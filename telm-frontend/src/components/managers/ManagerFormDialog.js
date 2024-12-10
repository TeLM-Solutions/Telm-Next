import React, {useEffect, useState} from 'react';
import * as yup from "yup";

import {dispatch, useSelector} from '@/store';
import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Button, CircularProgress, MenuItem, Stack, TextField} from "@mui/material";
import {fetchAllActiveBranches, resetBranchesState} from "@/store/slices/branchesSlice";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import DialogActions from "@mui/material/DialogActions";
import {createManager, fetchManagers, updateManager} from "@/store/slices/managerSlice";

import moment from 'moment-timezone';
import useMediaQuery from "@mui/material/useMediaQuery";

moment.tz.setDefault('Asia/Dubai');

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const validationSchema = yup.object().shape({
    name: yup.string().required('Please enter manager name'),
    contact_number: yup.string().required('Please enter manager contact number'),
    email: yup.string().email('Enter a valid email address').required('Enter manager email address'),
});
const ManagerFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {

    console.log(initialData?.managed_branch?.id)

    const {isCreating, isUpdating} = useSelector((state) => state.managers);
    const {loading, branches} = useSelector((state) => state.branches);
    const [emailError, setEmailError] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            contact_number: initialData?.contact_number || "",
            email: initialData?.email || "",
            branch: initialData?.managed_branch?.id || null,
            gender: initialData?.gender || null,
            join_date: initialData?.join_date ? moment(initialData.join_date) : null,
        },
        values: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            contact_number: initialData?.contact_number || "",
            email: initialData?.email || "",
            branch: initialData?.managed_branch?.id || null,
            gender: initialData?.gender || null,
            join_date: initialData?.join_date ? moment(initialData.join_date) : null,

        }
    });

    // Inside your onSubmit function
    const onSubmit = async (data) => {
        setEmailError('')

        try {
            if (!initialData) {
                const result = await dispatch(createManager(data));
                if (createManager.rejected.match(result)) {
                    const errorData = result.payload; // Access the error data
                    // Check if the "email" key exists in the errorData
                    if (errorData && errorData.email) {
                        setEmailError(errorData.email[0]);
                    }
                    console.log('Validation error:', errorData);
                } else {
                    dispatch(fetchManagers())
                    onSuccess();
                    handleClose();
                }
            } else {
                const formData = {
                    id: initialData.id,
                    data: data
                }
                const result = await dispatch(updateManager(formData));
                if (updateManager.rejected.match(result)) {
                    const errorData = result.payload; // Access the error data
                    // Check if the "email" key exists in the errorData
                    if (errorData && errorData.email) {
                        setEmailError(errorData.email[0]);
                    }
                    console.log('Validation error:', errorData);
                } else {
                    dispatch(fetchManagers())
                    onSuccess(true);
                    handleClose()
                }
            }
        } catch (error) {
            console.error('Error creating manager:', error);
        }
    };

    const handleClose = () => {
        handleDialogClose();
        setEmailError('')
        dispatch(resetBranchesState());
        reset();
    }

    useEffect(() => {
        if (isDialogOpen) {
            let query = null
            if (initialData && initialData.managed_branch) {
                query = {
                    include: initialData.managed_branch.id
                }
            }
            dispatch(fetchAllActiveBranches(query));
        }
    }, [isDialogOpen])


    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            fullScreen={isMobile}
            scroll={isMobile ? "paper" : "body"}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                {initialData ? 'Update Manager' : 'New Manager'}

            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon/>
            </IconButton>
            <DialogContent dividers sx={{padding: 0}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack direction={"column"}
                           sx={{
                               gap: '1.5rem',
                               width: isMobile ? '100vw' : '37.5rem',
                               'flex': 'none',
                               padding: '1.5rem'
                           }}>
                        {/* Name */}
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    name="name"
                                    placeholder="Enter manager name"
                                    autoFocus
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />

                        <Stack direction="row"
                               alignItems="center"
                               sx={{gap: '1rem'}}
                        >
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        error={!!errors.email || emailError}
                                        helperText={errors.email?.message || emailError}
                                    />
                                )}
                            />
                            <Controller
                                name="contact_number"
                                control={control}
                                defaultValue=""
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        required
                                        fullWidth
                                        id="contact_number"
                                        label="Contact Number"
                                        name="contact_number"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />

                        </Stack>


                        <Controller
                            name="branch"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    id="select-branch"
                                    select
                                    label="Branch"
                                >
                                    <MenuItem value="">

                                    </MenuItem>
                                    {!loading && branches.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Accordion
                            defaultExpanded={!!(initialData?.address || initialData?.join_date || initialData?.gender)}
                            sx={{
                                maxWidth: 'none !important',
                                background: 'linear-gradient(180deg, #FFFBED 0%, rgba(255, 251, 237, 0.00) 100%)',
                            }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Additional Info (optional)</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{
                                paddingBottom: {
                                    xs: '6rem',
                                    md: '1rem'
                                }

                            }}>

                                <Stack direction={"column"}
                                       sx={{gap: '1.5rem'}}>
                                    <Controller
                                        name="address"
                                        control={control}
                                        defaultValue=""

                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                sx={{background: '#fff'}}
                                                multiline
                                                maxRows={8}
                                                minRows={5}
                                                id="address"
                                                label="Address"
                                                name="address"
                                            />
                                        )}
                                    />

                                    <Stack direction={"row"}
                                           sx={{gap: '1.5rem'}}>

                                        <Controller
                                            name="gender"
                                            control={control}
                                            defaultValue=""
                                            render={({field}) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    sx={{background: '#fff'}}
                                                    id="select-gender"
                                                    select
                                                    label="Gender"
                                                    defaultValue=""
                                                >
                                                    <MenuItem key={""} value={""}>
                                                        -
                                                    </MenuItem>
                                                    <MenuItem key={"Male"} value={"male"}>
                                                        Male
                                                    </MenuItem>
                                                    <MenuItem key={"Female"} value={"Female"}>
                                                        Female
                                                    </MenuItem>
                                                    <MenuItem key={"Other"} value={"Other"}>
                                                        Other
                                                    </MenuItem>
                                                </TextField>
                                            )}
                                        />

                                        <Controller
                                            name="join_date"
                                            control={control}
                                            defaultValue=""
                                            render={({field}) => (
                                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                                    <DatePicker sx={{width: '400px'}}  {...field} label="Join Date"
                                                                value={field.value ? field.value : null}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                        />

                                    </Stack>

                                </Stack>

                            </AccordionDetails>
                        </Accordion>
                    </Stack>

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
                                            size={isMobile ? "large" : ''}>
                                        Create Manager
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
                                            size={isMobile ? "large" : ''}>
                                        Update Manager
                                    </Button>
                                )}
                            </>
                        }
                        <Button onClick={handleClose} color="secondary" size={isMobile ? "large" : ''}>
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </BootstrapDialog>
    )

}
export default React.memo(ManagerFormDialog);