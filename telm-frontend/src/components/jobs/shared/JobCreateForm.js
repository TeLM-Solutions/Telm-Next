import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Collapse,
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
import {ButtonAssign, ButtonAssignActive} from "@/styles/styles";
import {CheckCircle} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import UserAvatar from "@/components/common/UserAvatar";
import FormLeadList from "@/components/jobs/shared/FormLeadList";
import ColorBox from "@/components/common/ColorBox";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import * as yup from "yup";
import moment from "moment-timezone";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "@/store";
import {yupResolver} from "@hookform/resolvers/yup";
import {fetchAllLeads} from "@/store/slices/leadSlice";
import {fetchAllExecutives} from "@/store/slices/executiveSlice";
import {createJob, fetchJobs, updateJob} from "@/store/slices/jobSlice";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useAuth} from "@/hooks/auth";

moment.tz.setDefault('Asia/Dubai');
const validationSchema = yup.object().shape({
    start_date: yup.string().required('Please select start date'),
    end_date: yup.string().required('Please select end date'),
    lead_id: yup.string().required('Please select a lead'),
    user_id: yup.string().required('Please select a executive'),
});
const JobCreateForm = ({
                           initialData = null,
                           initialFilterState,
                           onSuccess,
                           isDialogOpen,
                           onCancel,
                           directEmbedData = null
                       }) => {
    const {user} = useAuth({middleware: 'auth'})

    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);

    const {isCreating, isUpdating} = useSelector((state) => state.jobs);
    const dispatch = useDispatch();

    const {loading: leadsLoading, allLeads: leads} = useSelector((state) => state.leads);
    const {allExecutives: executives} = useSelector((state) => state.executives);

    const [availableLeads, setAvailableLeads] = useState([]);
    const [selectedLeadServices, setSelectedLeadServices] = useState([]);

    const [assignedTo, setAssignedTo] = useState('manager');

    const [isDataLoading, setIsDataLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


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
            start_date: initialData?.start_date ? moment(initialData.start_date) : "",
            end_date: initialData?.end_date ? moment(initialData.end_date) : "",
            lead_id: initialData?.lead_id || '',
            user_id: initialData?.user_id || ''
        },
        values: {
            start_date: initialData?.start_date ? moment(initialData.start_date) : "",
            end_date: initialData?.end_date ? moment(initialData.end_date) : "",
            lead_id: initialData?.lead_id || '',
            user_id: initialData?.user_id || ''
        }
    });

    useEffect(() => {
        if (initialData) {
            if (user.id != initialData.user_id) {
                setAssignedTo('executive');
            }
            updateInitialData(initialData)
            setSelectedStartDate(moment(initialData.start_date))

        } else {
            setValue('user_id', user.id);
        }
    }, [initialData])

    useEffect(() => {
        if (directEmbedData) {
            updateInitialData(directEmbedData)
            setValue('lead_id', directEmbedData.lead_id)
        }
    }, [directEmbedData])

    const updateInitialData = (initialData) => {
        setSelectedLead(parseInt(initialData.lead_id))
        setSelectedLeadServices(initialData.lead.services)
        initialData.lead.services.map((service) => {
            const priceFrom = service.pivot.price_from ? removeDecimalIfZero(service.pivot.price_from) : '';
            const priceTo = service.pivot.price_to ? removeDecimalIfZero(service.pivot.price_to) : '';

            setValue(`services_from-${service.id}`, priceFrom);
            setValue(`services_to-${service.id}`, priceTo);

            return null;
        });
    }

    function removeDecimalIfZero(num) {
        const formattedNum = parseFloat(num).toFixed(2); // Ensure two decimal places
        return formattedNum.endsWith('.00') ? formattedNum.slice(0, -3) : formattedNum;
    }

    useEffect(() => {
        if (!isDataLoading && isDialogOpen) {
            if (leads.length) {
                setAvailableLeads(leads);
            }
            if (initialData && initialData.lead) {
                setAvailableLeads(prevAvailableLeads => [initialData?.lead, ...prevAvailableLeads]);
            }
        }

    }, [leads, isDialogOpen, isDataLoading]);

    useEffect(() => {
        fetchData();
    }, [isDialogOpen])

    const fetchData = async () => {
        await dispatch(fetchAllLeads());
        await dispatch(fetchAllExecutives());
        setIsDataLoading(false)
    }

    const onSubmit = async (data) => {
        try {
            if (!initialData) {
                data.services = selectedServicesData;
                await dispatch(createJob(data));
                dispatch(fetchJobs(initialFilterState))
                onSuccess()
            } else {
                data.services = selectedServicesData;
                const formData = {
                    id: initialData.id,
                    formData: data
                }
                await dispatch(updateJob(formData));
                onSuccess(true)
            }
            handleClose()
        } catch (error) {
            console.error('Error creating job:', error);
        }
    };

    const handleLeadClick = (leadId) => {
        // Update the selected lead in the state
        setSelectedLead(leadId);
        // Update the lead_lead_id field value in the form
        setValue('lead_id', leadId);
        const selected_lead = availableLeads.find(lead => lead.id === leadId);
        setSelectedLeadServices(selected_lead.services);
    };

    const selectedServicesData = selectedLeadServices.length > 0 && selectedLeadServices.map((service) => ({
        id: service.id,
        from: watch(`services_from-${service.id}`), // Assuming you're using React Hook Form
        to: watch(`services_to-${service.id}`), // Assuming you're using React Hook Form
    }));

    const handleClose = () => {
        onCancel();
        setSelectedLead(null)
        setAvailableLeads([])
        setSelectedStartDate(null)
        setSelectedLeadServices([])
        reset();
    }

    const handleAssign = (type) => {
        setAssignedTo(type)
        if (type === 'manager') {
            setValue('user_id', user.id);
        } else {
            setValue('user_id', '');
        }
    }

    return (
        <>
            {leadsLoading &&
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
                <Stack direction={{
                    xs: 'column',
                    md: 'row'

                }} sx={{
                    width: isMobile ? '100vw' : '55vw', paddingBottom: {
                        xs: '5rem',
                        md: 0
                    }
                }}>
                    <Stack direction="column"
                           alignItems="start"
                           sx={{flex: 1}}
                    >
                        <Stack direction={"column"}
                               sx={{gap: '1.5rem', padding: '1.5rem'}}>

                            <Stack direction="row"
                                   alignItems="start"
                                   sx={{gap: '1.5rem'}}
                            >

                                <Box>
                                    <Controller
                                        name="start_date"
                                        control={control}
                                        defaultValue=""
                                        render={({field}) => (
                                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                                <DatePicker {...field}
                                                            label="Start Date"
                                                            value={field.value ? field.value : null}
                                                            onChange={(date) => {
                                                                field.onChange(date);
                                                                setSelectedStartDate(date); // Update selected start date
                                                            }}

                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    {errors.start_date && (
                                        <Typography
                                            sx={{
                                                color: 'red',
                                                fontSize: '0.85rem'
                                            }}>{errors.start_date.message}</Typography>
                                    )}
                                </Box>

                                <Box>
                                    <Controller
                                        name="end_date"
                                        control={control}
                                        defaultValue=""
                                        render={({field}) => (
                                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                                <DatePicker {...field} label="End Date"
                                                            value={field.value ? field.value : null}
                                                            minDate={selectedStartDate}
                                                            disabled={!initialData && !selectedStartDate}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    {errors.end_date && (
                                        <Typography
                                            sx={{
                                                color: 'red',
                                                fontSize: '0.85rem'
                                            }}>{errors.end_date.message}</Typography>
                                    )}
                                </Box>

                            </Stack>

                            <Stack gap={"1rem"}>

                                <Typography
                                    sx={{
                                        fontSize: '0.85rem'
                                    }}>Lead Assigned To</Typography>

                                <ButtonGroup variant="outlined"
                                             aria-label="outlined info button group"
                                >

                                    <Button
                                        sx={assignedTo === 'manager' ? ButtonAssignActive : ButtonAssign}
                                        onClick={() => handleAssign('manager')}
                                        startIcon={assignedTo === 'manager' ? <CheckCircle/> :
                                            <RadioButtonUncheckedIcon/>}
                                    >
                                        Your Self
                                    </Button>

                                    <Button
                                        sx={assignedTo === 'executive' ? ButtonAssignActive : ButtonAssign}
                                        onClick={() => handleAssign('executive')}
                                        startIcon={assignedTo === 'executive' ? <CheckCircle/> :
                                            <RadioButtonUncheckedIcon/>}
                                    >
                                        Executive
                                    </Button>

                                </ButtonGroup>


                                <Collapse in={assignedTo === 'executive'} unmountOnExit>
                                    <Controller
                                        name="user_id"
                                        control={control}
                                        defaultValue=""
                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                required
                                                id="select-user_id"
                                                select
                                                label="Executive"
                                            >
                                                {executives.map((executive) => (
                                                    <MenuItem key={executive.id} value={executive.id}>
                                                        <Stack direction="row"
                                                               alignItems="center"
                                                               sx={{gap: '0.5rem'}}>
                                                            <UserAvatar name={executive.name}/>
                                                            <Stack>
                                                                <Typography varient={"body2"}
                                                                            sx={{fontSize: '0.875rem'}}>{executive.name}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                    {errors.user_id && (
                                        <Typography
                                            sx={{
                                                color: 'red',
                                                fontSize: '0.85rem'
                                            }}>{errors.user_id.message}</Typography>
                                    )}
                                </Collapse>
                            </Stack>
                            <Divider/>

                        </Stack>

                        <Stack direction={"column"}
                               sx={{
                                   gap: '1.5rem',
                                   flex: 'none',
                                   padding: '1rem 1.5rem',
                                   alignSelf: 'stretch',
                                   width: '100%'
                               }}
                        >


                            <Controller
                                name="lead_id"
                                control={control}
                                defaultValue={null}
                                render={({field}) => (
                                    <>
                                        <FormLeadList leads={availableLeads} handleLeadClick={handleLeadClick}
                                                      selectedLead={selectedLead} isLoading={isDataLoading}
                                                      disableSelect={directEmbedData}/>
                                    </>
                                )}
                            />

                            {errors.lead_id && (
                                <Typography
                                    sx={{color: 'red', fontSize: '0.85rem'}}>{errors.lead_id.message}</Typography>
                            )}


                        </Stack>

                    </Stack>


                    <Stack direction={"column"}
                           sx={{
                               gap: '1.5rem',
                               background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                               padding: '1.5rem',
                               alignSelf: 'stretch',
                               flex: 1,
                               width: '100%'
                           }}
                    >

                        <Stack direction={"row"}
                               justifyContent={"space-between"}
                               alignSelf={"stretch"}
                               alignItems={"center"}
                        >
                            <Typography
                                component={"h4"}
                                sx={{
                                    fontWeight: 500,
                                }}
                            >
                                Services
                            </Typography>
                        </Stack>

                        {selectedLeadServices.length == 0 &&
                            <Alert severity={"info"}>Select a lead</Alert>
                        }

                        <Stack direction={"column"}
                               sx={{
                                   borderRadius: '0.5rem',
                                   background: '#fff',
                                   boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
                                   overflow: 'hidden',
                                   '& > div': {
                                       display: 'flex',
                                       padding: '1rem',
                                       justifyContent: 'space-between',
                                       alignItems: 'center',
                                       alignSelf: 'stretch',
                                       borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                       '&:last-child': {
                                           borderBottom: 'none'
                                       },
                                       '&.active': {
                                           background: 'linear-gradient(156deg, #C9F2FF 0%, #FFF 100%)'
                                       }
                                   }
                               }}
                        >

                            {selectedLeadServices.length > 0 && selectedLeadServices.map((service) => (
                                <Stack alignItems={"center"} direction={"row"} key={service.id}>
                                    <Stack gap={"1rem"}>
                                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                            <ColorBox text={service.name}/>
                                            <Typography className={"service-name"}>
                                                {service.name}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row"
                                               alignItems="center"
                                               sx={{gap: '1.5rem'}}
                                        >
                                            {/* Contact Number */}
                                            <Controller
                                                name={`services_from-${service.id}`}
                                                control={control}
                                                defaultValue={service.pivot.price_from}
                                                render={({field}) => (
                                                    <TextField
                                                        {...field}
                                                        required
                                                        fullWidth
                                                        id={`services_from-${service.id}`}
                                                        label="Price From"
                                                        name={`services_from-${service.id}`}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment
                                                                    position="start">AED</InputAdornment>
                                                            ),
                                                        }}
                                                        error={!!errors.services_from}
                                                        helperText={errors.services_from?.message}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name={`services_to-${service.id}`}
                                                control={control}
                                                defaultValue={service.pivot.price_to}
                                                render={({field}) => (
                                                    <TextField
                                                        {...field}
                                                        required
                                                        fullWidth
                                                        id={`services_to-${service.id}`}
                                                        label="Price To"
                                                        name={`services_to-${service.id}`}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment
                                                                    position="start">AED</InputAdornment>
                                                            ),
                                                        }}
                                                        error={!!errors.services_to}
                                                        helperText={errors.services_to?.message}
                                                    />
                                                )}
                                            />
                                        </Stack>


                                    </Stack>
                                </Stack>
                            ))}

                        </Stack>
                        {errors.lead_id && (
                            <Typography
                                sx={{color: 'red', fontSize: '0.85rem'}}>{errors.lead_id.message}</Typography>
                        )}

                    </Stack>


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
                                <>
                                    {!initialData && !leadsLoading && leads.length > 0 &&
                                        <Button color="secondary" variant="contained" type={"submit"}
                                                size={isMobile ? "large" : ''}>
                                            Create Job
                                        </Button>
                                    }
                                </>

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
                                        size={isMobile ? "large" : ''}>
                                    Update Job
                                </Button>
                            )}
                        </>
                    }
                    {!directEmbedData &&
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                    }
                </DialogActions>
            </form>
        </>
    )
}
export default JobCreateForm;