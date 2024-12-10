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
import {Box, Button, CircularProgress, MenuItem, Paper, Stack, TextField} from "@mui/material";
import {useMemo, useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import DialogActions from "@mui/material/DialogActions";
import {createExecutive, fetchExecutives, updateExecutive} from "@/store/slices/executiveSlice";
import moment from 'moment-timezone';
import Uppy from "@uppy/core";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import XHRUpload from '@uppy/xhr-upload';
import fetchCSRFToken from "@/lib/getToken";
import AttachedDocument from "@/components/executives/dialog/AttachedDocument";
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
    name: yup.string().required('Please enter executive name'),
    contact_number: yup.string().required('Please enter executive contact number'),
    email: yup.string().email('Enter a valid email address').required('Enter executive email address'),
});
const ExecutiveFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {

    const {isCreating, isUpdating} = useSelector((state) => state.executives);
    const [emailError, setEmailError] = useState('');
    const [CSRF, setCSRF] = useState(null)

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isUploading, setIsUploading] = useState(false);

    const initializeUppyWithCSRF = (csrfToken) => {
        return new Uppy({
            restrictions: {
                allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            },
            autoProceed: false,
        }).use(XHRUpload, {
            endpoint: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/executives/documents',
            formData: true,
            fieldName: 'file',
            withCredentials: true,
            limit: 1,
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                // Other headers if needed
            },
        });
    };

    const getToken = async () => {
        const csrf = await fetchCSRFToken();
        setCSRF(csrf);
    };

    if (isDialogOpen && CSRF === null) {
        getToken();
    }
    const uppyDocuments = useMemo(() => {
        if (CSRF !== null) {
            return initializeUppyWithCSRF(CSRF);
        }
        return null; // Return null if CSRF is not available yet
    }, [CSRF]);

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
            gender: initialData?.gender || null,
            join_date: initialData?.join_date ? moment(initialData.join_date) : null,
        },
        values: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            contact_number: initialData?.contact_number || "",
            email: initialData?.email || "",
            gender: initialData?.gender || null,
            join_date: initialData?.join_date ? moment(initialData.join_date) : null,
        }
    });

    // Inside your onSubmit function
    const onSubmit = async (data, event) => {
        event.preventDefault();
        setEmailError('')

        try {
            if (!initialData) {
                const result = await dispatch(createExecutive(data));
                if (createExecutive.rejected.match(result)) {
                    const errorData = result.payload; // Access the error dat
                    // Check if the "email" key exists in the errorData
                    if (errorData && errorData.email) {
                        setEmailError(errorData.email[0]);
                    }
                    console.log('Validation error:', errorData);
                } else {
                    if (uppyDocuments.getFiles().length > 0) {
                        setIsUploading(true)
                        uppyDocuments.setMeta({
                            id: result.payload.id,
                        });
                        uppyDocuments.upload();
                        uppyDocuments.on('complete', (file, response) => {
                            onSuccess()
                            dispatch(fetchExecutives())
                            handleClose()
                        })
                    } else {
                        dispatch(fetchExecutives())
                        onSuccess()
                        handleClose()
                    }

                }
            } else {
                const formData = {
                    id: initialData.id,
                    data: data
                }
                const result = await dispatch(updateExecutive(formData));
                if (updateExecutive.rejected.match(result)) {
                    const errorData = result.payload; // Access the error data
                    // Check if the "email" key exists in the errorData
                    if (errorData && errorData.email) {
                        setEmailError(errorData.email[0]);
                    }
                    console.log('Validation error:', errorData);
                } else {
                    if (uppyDocuments.getFiles().length > 0) {
                        setIsUploading(true)
                        uppyDocuments.setMeta({
                            id: initialData.id
                        });
                        uppyDocuments.upload();
                        uppyDocuments.on('complete', (file, response) => {
                            dispatch(fetchExecutives())
                            handleClose()
                            onSuccess(true)
                        })
                    } else {
                        onSuccess(true)
                        dispatch(fetchExecutives())
                        handleClose(true)
                    }
                }
            }
        } catch (error) {
            console.error('Error creating executive:', error);
        }
    };

    const handleClose = () => {
        handleDialogClose();
        setEmailError('')
        setIsUploading(false);
        if (uppyDocuments !== null) {
            uppyDocuments.cancelAll();
        }
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
                {!initialData ? 'New Executive' : 'Update Executive'}
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
                {/*<form onSubmit={handleSubmit(onSubmit)} noValidate>*/}

                <Stack direction={{
                    xs: 'column',
                    md: 'row'
                }} sx={{width: isMobile ? '100vw' : 'fit-content'}}>
                    <Stack direction={"column"}
                           sx={{
                               gap: '1.5rem',
                               width: isMobile ? '100vw' : 'fit-content',
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
                                    placeholder="Enter executive name"
                                    autoFocus
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />

                        <Stack direction={{
                            xs: 'column',
                            md: 'row'
                        }}
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
                                        error={!!errors.email || !!emailError}
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
                                        error={!!errors.contact_number}
                                        helperText={errors.contact_number?.message}
                                    />
                                )}
                            />

                        </Stack>

                        <Accordion
                            defaultExpanded={!!(initialData?.address || initialData?.join_date || initialData?.gender)}
                            sx={{
                                maxWidth: 'none !important',
                                background: 'linear-gradient(180deg, #FFFBED 0%, rgba(255, 251, 237, 0.00) 100%)'
                            }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Additional Info (optional)</Typography>
                            </AccordionSummary>
                            <AccordionDetails>

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
                                Documents
                            </Typography>
                        </Stack>

                        <Box className={"document-uppy"} sx={{

                            minWidth: {
                                sx: 'auto',
                                md: '25rem'
                            },
                            marginBottom: {
                                xs: '5rem',
                                md: 0
                            }

                        }}>

                            {CSRF &&
                                <Dashboard uppy={uppyDocuments}
                                           hideUploadButton
                                           width={"100%"}
                                           height={'fit-content'}
                                           plugins={['FileInput']}
                                           note={"only PDF,DOC,DOCX, JPEG, PNG are accepted"}
                                           proudlyDisplayPoweredByUppy={false}
                                />
                            }

                            {initialData && initialData.executive_documents.length > 0 &&

                                <Paper sx={{padding: '1rem', marginTop: '1rem', maxWidth: '100% !important'}}>
                                    <Stack gap={"1rem"}>
                                        <Typography
                                            component={"h4"}
                                            sx={{
                                                fontWeight: 500,
                                            }}
                                        >
                                            Attached Documents
                                        </Typography>

                                        <Stack gap={"0.5rem"}>

                                            {initialData.executive_documents.map((document, index) => (
                                                <AttachedDocument key={index} document={document}/>
                                            ))}

                                        </Stack>
                                    </Stack>

                                </Paper>
                            }


                        </Box>

                    </Stack>


                </Stack>


                <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>
                    {!initialData &&
                        <>
                            {isCreating || isUploading ? (
                                <Button color="secondary" variant="contained" disabled size={isMobile ? "large" : ''}>
                                    <CircularProgress size={"1.5rem"}/>
                                </Button>
                            ) : (
                                <Button
                                    size={isMobile ? "large" : ''}
                                    onClick={(event) => handleSubmit(onSubmit)(event)}
                                    color="secondary" variant="contained" type={"submit"}>
                                    Create Executive
                                </Button>
                            )}
                        </>
                    }
                    {initialData &&
                        <>
                            {isUpdating ? (
                                <Button color="secondary" variant="contained" disabled size={isMobile ? "large" : ''}>
                                    <CircularProgress size={"1.5rem"}/>
                                </Button>
                            ) : (
                                <Button
                                    size={isMobile ? "large" : ''}
                                    onClick={(event) => handleSubmit(onSubmit)(event)}
                                    color="secondary" variant="contained" type={"submit"}>
                                    Update Executive
                                </Button>
                            )}
                        </>
                    }
                    <Button onClick={handleClose} size={isMobile ? "large" : ''} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
                {/*</form>*/}
            </DialogContent>
        </BootstrapDialog>
    )

}
export default ExecutiveFormDialog;