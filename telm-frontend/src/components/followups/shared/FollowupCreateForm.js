import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {MobileTimePicker} from "@mui/x-date-pickers/MobileTimePicker";
import {ErrorSharp, Group, PermPhoneMsg} from "@mui/icons-material";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import FollowUpJobsTable from "@/components/followups/shared/FollowUpJobsTable";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment-timezone";
import * as yup from "yup";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "@/store";
import {yupResolver} from "@hookform/resolvers/yup";
import {checkDateAndTime, createFollowUp, updateFollowUp} from "@/store/slices/followupSlice";
import {fetchActiveJobs, resetJobsState} from "@/store/slices/jobSlice";
import {fetchReasons} from "@/store/slices/reasonsSlice";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {publish} from "@/lib/events";

moment.tz.setDefault('Asia/Dubai');

const validationSchema = yup.object().shape({
    date: yup.string().required('Please select a date'),
    job_id: yup.string().required('Please select a job'),
    reason: yup.string().required('Please select a reason'),
    contact_type: yup.string().required('Please select a contact type'),
});

const FollowupCreateForm = ({
                                isDialogOpen,
                                handleDialogClose,
                                initialData = null,
                                onSuccess,
                                initialFilterState,
                                directEmbedData = null
                            }) => {

    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedContactType, setSelectedContactType] = useState(null);

    const {isCreating, isUpdating} = useSelector((state) => state.followups);
    const dispatch = useDispatch();
    const {loading: reasonLoading, reasons} = useSelector((state) => state.reasons);

    const {loading, allJobs: jobs} = useSelector((state) => state.jobs);

    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [dateTimeConflict, setDateTimeConflict] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const ContactTypeButton = ({contactType, selectedContactType, handleContactTypeClick, icon, text}) => (
        <Button
            startIcon={icon}
            onClick={() => handleContactTypeClick(contactType)}
            sx={{
                color: selectedContactType === contactType ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                borderColor: 'rgba(0, 0, 0, 0.50)',
                backgroundColor: selectedContactType === contactType ? '#0080ff' : '#fff',
                '&:hover': {
                    background: '#0080ff',
                    color: 'white'
                }
            }}
        >
            {text}
        </Button>
    );


    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        reset,
        watch
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            date: initialData?.date ? moment(initialData.date) : moment(new Date()),
            job_id: initialData?.job_id || '',
            reason: initialData?.reason.id || '',
            time: initialData?.time_full ? moment(initialData.time_full) : moment(new Date()),
        },
        values: {
            date: initialData?.date ? moment(initialData.date) : "",
            job_id: initialData?.job_id || '',
            reason: initialData?.reason.id || '',
            time: initialData?.time_full ? moment(initialData.time_full) : "",
        }
    });

    useEffect(() => {
        if (initialData) {
            setSelectedJob(parseInt(initialData.job_id))
            setSelectedContactType(initialData.contact_type)
            setValue('contact_type', initialData.contact_type);
        } else {
            setValue('date', moment(new Date()))
            setValue('time', moment(new Date()))
        }
    }, [initialData])

    useEffect(() => {
        if (directEmbedData) {
            setSelectedJob(parseInt(directEmbedData.job_id))
            setValue("job_id", parseInt(directEmbedData.job_id))
        }
    }, [directEmbedData])

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isDialogOpen) {
            fetchDatas();
        }
    }, [isDialogOpen]);

    useEffect(() => {

        if (selectedTime && selectedDate) {
            handleCheckDateValidation();
        }

    }, [selectedDate, selectedTime])

    const handleCheckDateValidation = async () => {
        setDateTimeConflict(false)
        const data = {
            date: moment(selectedDate).format('YYYY-MM-DD'),
            time: moment(selectedTime).format('h:mm A'),
        }
        const response = await dispatch(checkDateAndTime(data))
        if (response.payload.message === 'exist') {
            setDateTimeConflict(true)
        } else {
            setDateTimeConflict(false)
        }
    }

    const fetchDatas = async () => {
        await dispatch(fetchActiveJobs());
        await dispatch(fetchReasons());
        setIsLoading(false);
    }

    const onSubmit = async (data) => {
        try {
            if (!initialData) {
                // Dispatch the createJob action with the form data
                await dispatch(createFollowUp(data));
                onSuccess()
            } else {
                const formData = {
                    id: initialData.id,
                    formData: data
                }
                await dispatch(updateFollowUp(formData));
                onSuccess(true)
            }
            publish('reload_followups_table')
            handleClose()
        } catch (error) {
            console.error('Error creating followup:', error);
        }
    };

    const handleJobClick = (jobId) => {
        setSelectedJob(jobId);
        setValue('job_id', jobId);
    };

    const handleContactTypeClick = (type) => {
        setSelectedContactType(type);
        setValue('contact_type', type);
    };
    const handleClose = () => {
        handleDialogClose();
        if (!directEmbedData) {
            dispatch(resetJobsState())
        }
        setSelectedJob(null)
        reset();
        setIsLoading(true)
    }

    return (
        <>
            {isLoading &&
                <Box sx={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, background: '#ffffff96',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <CircularProgress/>
                </Box>
            }
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack direction="column"
                       alignItems="start"
                >
                    <Stack direction={"column"}
                           sx={{
                               gap: '1rem',
                               width: isMobile ? '100vw' : '40rem',
                               'flex': 'none',
                               padding: '1.5rem'
                           }}>


                        <Controller
                            name="reason"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    required
                                    id="select-reason"
                                    select
                                    label="Follow Up Reason"
                                >
                                    {reasons.map((reason) => (
                                        <MenuItem key={reason.id} value={reason.id}>
                                            {reason.title}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        {errors.reason && (
                            <Typography
                                sx={{color: 'red', fontSize: '.875rem'}}>{errors.reason.message}</Typography>
                        )}
                        <Stack direction="row"
                               alignItems="start"
                               sx={{gap: '1.5rem'}}
                        >
                            <Box>
                                <Controller
                                    name="date"
                                    control={control}
                                    defaultValue=""
                                    render={({field}) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DatePicker {...field}
                                                        label="Date"
                                                        value={field.value ? field.value : moment(new Date())}
                                                        onChange={(date) => {
                                                            field.onChange(date);
                                                            setSelectedDate(date);
                                                            if (selectedTime === '' && initialData?.time_full) {
                                                                setSelectedTime(initialData?.time_full)
                                                            }
                                                        }}

                                            />
                                        </LocalizationProvider>
                                    )}
                                />
                                {errors.date && (
                                    <Typography
                                        sx={{
                                            color: 'red',
                                            fontSize: '0.85rem'
                                        }}>{errors.date.message}</Typography>
                                )}
                            </Box>
                            <Box>
                                <Controller
                                    name="time"
                                    control={control}
                                    defaultValue=""

                                    render={({field}) => (
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <MobileTimePicker {...field}
                                                              value={field.value ? field.value : moment(new Date())}
                                                              label="Time"
                                                              onChange={(time) => {
                                                                  field.onChange(time);
                                                                  setSelectedTime(time);
                                                                  if (selectedDate === '' && initialData?.date) {
                                                                      setSelectedDate(initialData?.date)
                                                                  }
                                                              }}/>
                                        </LocalizationProvider>
                                    )}
                                />
                            </Box>
                        </Stack>

                        {dateTimeConflict && (
                            <Stack direction={"row"} gap={"0.5rem"}>
                                <ErrorSharp sx={{color: '#dd0000'}}/>
                                <Typography
                                    sx={{
                                        color: '#dd0000',
                                        fontSize: '0.85rem'
                                    }}>You already have a follow-up scheduled for this date and time. Please choose
                                    a
                                    different date or time for the follow-up.</Typography>
                            </Stack>
                        )}

                        <Stack gap={"0.5rem"}>
                            <Typography sx={{fontWeight: 500}}>Contact Type</Typography>

                            <ButtonGroup size="large" aria-label="large button group">
                                <ContactTypeButton
                                    contactType="call"
                                    selectedContactType={selectedContactType}
                                    handleContactTypeClick={handleContactTypeClick}
                                    icon={<PermPhoneMsg/>}
                                    text="Call"
                                />
                                <ContactTypeButton
                                    contactType="online"
                                    selectedContactType={selectedContactType}
                                    handleContactTypeClick={handleContactTypeClick}
                                    icon={<VideoCameraFrontIcon/>}
                                    text="Online Meeting"
                                />
                                <ContactTypeButton
                                    contactType="in-person"
                                    selectedContactType={selectedContactType}
                                    handleContactTypeClick={handleContactTypeClick}
                                    icon={<Group/>}
                                    text="In-Person"
                                />
                            </ButtonGroup>

                            {errors.contact_type && (
                                <Typography
                                    sx={{
                                        color: 'red',
                                        fontSize: '0.85rem'
                                    }}>{errors.contact_type.message}</Typography>
                            )}


                        </Stack>

                    </Stack>
                    <Divider/>

                    {!directEmbedData && !initialData &&

                        <Controller
                            name="job_id"
                            control={control}
                            defaultValue={null}
                            render={({field}) => (
                                <>
                                    {!isLoading &&

                                        <FollowUpJobsTable jobs={jobs} selectedJob={selectedJob}
                                                           isEdit={initialData}
                                                           handleJobClick={handleJobClick} isLoading={isLoading}/>
                                    }
                                </>
                            )}
                        />
                    }

                    {errors.job_id && (
                        <Stack padding={"0.5rem 1.5rem"}>
                            <Typography
                                sx={{color: 'red', fontSize: '0.85rem'}}>{errors.job_id.message}</Typography>
                        </Stack>

                    )}


                </Stack>
                <Divider/>


                <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>
                    {!initialData &&
                        <>
                            {isCreating ? (
                                <Button color="secondary" variant="contained" disabled
                                        size={isMobile ? "large" : ''}>
                                    <CircularProgress size={"1.5rem"}/>
                                </Button>
                            ) : (
                                <Button color="secondary" variant="contained" type={"submit"}
                                        size={isMobile ? "large" : ''}
                                        disabled={dateTimeConflict}

                                >
                                    Create Follow Up
                                </Button>
                            )}
                        </>
                    }
                    {initialData &&
                        <>
                            {isUpdating ? (
                                <Button color="secondary" variant="contained" disabled
                                        size={isMobile ? "large" : ''}>
                                    <CircularProgress size={"1.5rem"}/>
                                </Button>
                            ) : (
                                <Button color="secondary" variant="contained" type={"submit"}
                                        size={isMobile ? "large" : ''}
                                        disabled={dateTimeConflict}
                                >
                                    Update Follow Up
                                </Button>
                            )}
                        </>
                    }
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </>
    )
}

export default FollowupCreateForm