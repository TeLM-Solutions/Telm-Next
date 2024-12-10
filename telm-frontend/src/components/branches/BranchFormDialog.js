import {styled, useTheme} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Alert, Button, CircularProgress, Stack, TextField, Typography} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import UserAvatar from "@/components/common/UserAvatar";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DialogActions from "@mui/material/DialogActions";

import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup'
import {useEffect, useState} from "react";

import {useDispatch, useSelector} from '@/store';
import {createBranch, fetchBranches, updateBranch} from '@/store/slices/branchesSlice';
import {fetchAllManagers, resetManagersState} from "@/store/slices/managerSlice";
import useMediaQuery from "@mui/material/useMediaQuery";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const validationSchema = yup.object().shape({
    name: yup.string().required('Please enter branch name'),
    address: yup.string().required('Please enter address of the branch'),
    contact_number: yup.string().required('Please enter branch contact number'),
    email_address: yup.string().email('Enter a valid email address').required('Enter branch email address'),
});

const BranchFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [selectedManager, setSelectedManager] = useState(null);

    const {isCreating, isUpdating} = useSelector((state) => state.branches);
    const dispatch = useDispatch();

    const {loading, managers} = useSelector((state) => state.managers);
    const [loadedManagers, setLoadedManagers] = useState(false);


    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: initialData?.name || "", // Use initialData.name
            address: initialData?.address || "", // Use initialData.address
            contact_number: initialData?.contact_number || "", // Use initialData.contact_number
            email_address: initialData?.email_address || "", // Use initialData.email_address
            branch_manager_id: initialData?.branch_manager_id || null, // Use initialData.branch_manager_id
        },
        values: {
            name: initialData?.name || "", // Use initialData.name
            address: initialData?.address || "", // Use initialData.address
            contact_number: initialData?.contact_number || "", // Use initialData.contact_number
            email_address: initialData?.email_address || "", // Use initialData.email_address
            branch_manager_id: initialData?.branch_manager_id || null, // Use initialData.branch_manager_id
        }
    });

    useEffect(() => {
        if (initialData) {
            setSelectedManager(initialData.branch_manager_id)
        }
    }, [initialData])

    useEffect(() => {
        if (isDialogOpen && !loadedManagers) {

            let query = null
            if (initialData && initialData.branch_manager_id) {
                query = {
                    include: initialData.branch_manager_id
                }
            }

            loadManagers(query);
        }
    }, [managers, isDialogOpen]);


    const loadManagers = async (query = null) => {
        await dispatch(fetchAllManagers(query));
        setLoadedManagers(true);
    }

    const onSubmit = async (data) => {
        try {
            if (!initialData) {
                // Dispatch the createBranch action with the form data
                await dispatch(createBranch(data));
                onSuccess()
            } else {
                const formData = {
                    id: initialData.id,
                    branchData: data
                }
                await dispatch(updateBranch(formData));
                onSuccess(true)
            }
            await dispatch(fetchBranches());
            handleClose()
        } catch (error) {
            console.error('Error creating branch:', error);
        }
    };

    const handleManagerClick = (managerId) => {
        // Update the selected manager in the state
        setSelectedManager(managerId);

        // Update the branch_manager_id field value in the form
        setValue('branch_manager_id', managerId);
    };

    const handleClose = () => {
        handleDialogClose();
        setSelectedManager(null)
        setLoadedManagers(false);
        dispatch(resetManagersState())
        reset();
    }


    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            fullScreen={isMobile}
            scroll={isMobile ? "paper" : "body"}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                New Branch
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
                    <Stack direction={{
                        sx: "column",
                        md: 'row'
                    }}
                           alignItems="start"
                    >
                        <Stack direction={"column"}
                               sx={{
                                   gap: '1.5rem', width: {
                                       xs: '100vw',
                                       md: '32.5rem'
                                   }, 'flex': 'none', padding: '1.5rem'
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
                                        placeholder="Enter branch name here"
                                        autoFocus
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                            {/* Address */}
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        required
                                        fullWidth
                                        id="address"
                                        multiline
                                        maxRows={8}
                                        minRows={5}
                                        label="Address"
                                        name="address"
                                        placeholder="Full address of the branch"
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                    />
                                )}
                            />

                            <Stack direction={{
                                xs: 'column',
                                md: 'row'
                            }}
                                   alignItems="center"
                                   sx={{gap: '1.5rem'}}
                            >
                                {/* Contact Number */}
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
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">+971</InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.contact_number}
                                            helperText={errors.contact_number?.message}
                                        />
                                    )}
                                />
                                {/* Email Address */}
                                <Controller
                                    name="email_address"
                                    control={control}
                                    defaultValue=""
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            required
                                            fullWidth
                                            id="email_address"
                                            label="Email Address"
                                            name="email_address"
                                            error={!!errors.email_address}
                                            helperText={errors.email_address?.message}
                                        />
                                    )}
                                />
                            </Stack>

                        </Stack>

                        <Stack direction={"column"}
                               sx={{
                                   gap: '1.5rem',
                                   width: {
                                       md: '25rem',
                                   },
                                   flex: 'none',
                                   background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                                   padding: '1.5rem',
                                   alignSelf: 'stretch',
                                   paddingBottom: {
                                       xs: '10rem',
                                       md: 0
                                   }
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
                                    Select a Manager
                                </Typography>
                                {/*<TextField InputProps={{*/}
                                {/*    startAdornment: (*/}
                                {/*        <InputAdornment position="start">*/}
                                {/*            <SearchSharp/>*/}
                                {/*        </InputAdornment>*/}
                                {/*    ),*/}
                                {/*}}*/}
                                {/*           label={'Search'}*/}
                                {/*           sx={{width: '12.5rem', '& .MuiInputBase-root': {background: '#fff'}}}*/}
                                {/*           size={"small"}*/}
                                {/*           variant="outlined"*/}
                                {/*/>*/}
                            </Stack>

                            <Stack direction={"column"}
                                   sx={{
                                       borderRadius: '0.5rem',
                                       background: '#fff',
                                       boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
                                       '& > div': {
                                           display: 'flex',
                                           padding: '0.5rem 1rem',
                                           justifyContent: 'space-between',
                                           alignItems: 'center',
                                           alignSelf: 'stretch',
                                           cursor: 'pointer',
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
                                <Controller
                                    name="branch_manager_id"
                                    control={control}
                                    defaultValue={null}
                                    render={({field}) => (
                                        <>
                                            {loadedManagers && managers && managers.map((manager) => (
                                                <Stack alignItems={"center"} direction={"row"} key={manager.id}
                                                       onClick={() => handleManagerClick(manager.id)}
                                                       className={manager.id === selectedManager ? 'active' : ''}>
                                                    <Stack alignItems={"center"} gap={"0.5rem"} direction={"row"}>
                                                        <UserAvatar name={manager.name}/>
                                                        <Typography component={"h5"}>{manager.name}</Typography>
                                                    </Stack>
                                                    {manager.id !== selectedManager &&
                                                        <RadioButtonUncheckedIcon sx={{fill: "#AFAFAF"}}/>}
                                                    {manager.id === selectedManager &&
                                                        <CheckCircleIcon color={"secondary"}/>}
                                                </Stack>
                                            ))}
                                        </>
                                    )}
                                />


                                {/*<Stack alignItems={"center"} direction={"row"}>*/}
                                {/*    <Button disabled={true} variant="outlined">Prev</Button>*/}
                                {/*    <Button color="secondary" variant="outlined">Next</Button>*/}
                                {/*</Stack>*/}


                            </Stack>
                            {loadedManagers && managers && managers.length === 0 &&
                                <Alert severity="warning">No available managers found to assign</Alert>
                            }
                            {!loadedManagers &&
                                <CircularProgress size={"1.5rem"}/>
                            }

                        </Stack>

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
                                        Create Branch
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
                                        Update Branch
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
export default BranchFormDialog;