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
import '@uppy/core/dist/style.min.css';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Slider,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {checkBusiness, createLead, fetchLeads, updateLead} from "@/store/slices/leadSlice";
import BusinessIcon from "@mui/icons-material/Business";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import {Dashboard} from "@uppy/react";
import {useEffect, useMemo, useState} from "react";
import {fetchServices} from "@/store/slices/serviceSlice";
import ColorBox from "@/components/common/ColorBox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {fetchRoutes} from "@/store/slices/routesSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import fetchCSRFToken from "@/lib/getToken";
import uppyInit from "@/components/leads/shared/uppyInit";
import {fetchLeadSources} from "@/store/slices/leadSourcesSlice";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const validationSchema = yup.object().shape({
    name: yup.string().required('Please enter lead name'),
    email: yup.string().email('Please enter a valid email address'),
    landphone: yup.string().required('Please enter land phone number'),
    route: yup.string().required('Please select a route'),
    location: yup.string().required('Please select a location'),
    location_url: yup.string().url('Location must be a valid URL'),
    selectedServices: yup.array().min(1, "Select at least one service"),
});

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const LeadFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, initialFilterState, onSuccess}) => {

    const [businessData, setBusinessData] = useState(null); // Store data from the API response
    const [isCheckingBusiness, setIsCheckingBusiness] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [CSRF, setCSRF] = useState(null)
    const [isUploading, setIsUploading] = useState(false);


    const getToken = async () => {
        const csrf = await fetchCSRFToken();
        setCSRF(csrf);
    };

    if (isDialogOpen && CSRF === null) {
        if (!initialData) {
            getToken();
        }
    }

    const uppyVisitingCard = useMemo(() => {
        if (CSRF !== null && !initialData) {
            return uppyInit(CSRF, 'visiting-card')
        }
        return null; // Return null if CSRF is not available yet
    }, [CSRF]);

    const uppyStoreFront = useMemo(() => {
        if (CSRF !== null && !initialData) {
            return uppyInit(CSRF, 'store')
        }
        return null; // Return null if CSRF is not available yet
    }, [CSRF]);


    const {isCreating, isUpdating} = useSelector((state) => state.leads);
    const {loading, services} = useSelector((state) => state.services);
    const {routes} = useSelector((state) => state.routes);
    const {loading: isLeadSourceLoading, lead_sources} = useSelector((state) => state.leadSources);

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
            landphone: initialData?.business.landphone || "",
            name: initialData?.business.name || "",
            route: initialData?.business.location.route_id || "",
            location: initialData?.business.location.id || "",
            location_url: initialData?.business.location_url || "",
            urgency: initialData?.urgency || 0,
            lead_status: initialData?.lead_status || 0,
            selectedServices: initialData?.services.map(service => service.id) || [],
            contact_name: initialData?.business.contacts[0]?.name || "",
            contact_phone: initialData?.business.contacts[0]?.phone_number || "",
            note: initialData?.note || "",
            email: initialData?.business?.email || "",
            address: initialData?.business?.address || "",
            lead_source_id: initialData?.lead_source_id || "",
        },
        values: {
            landphone: initialData?.business.landphone || "",
            name: initialData?.business.name || "",
            route: initialData?.business.location.route_id || "",
            location: initialData?.business.location.id || "",
            location_url: initialData?.business.location_url || "",
            urgency: initialData?.urgency || 0,
            lead_status: initialData?.lead_status || 0,
            selectedServices: initialData?.services.map(service => service.id) || [],
            contact_name: initialData?.business.contacts[0]?.name || "",
            contact_phone: initialData?.business.contacts[0]?.phone_number || "",
            note: initialData?.note || "",
            email: initialData?.business?.email || "",
            address: initialData?.business?.address || "",
            lead_source_id: initialData?.lead_source_id || "",
        }
    });

    const selectedRoute = watch('route');

    const checkBusinessData = debounce(async (landphone) => {
        if (landphone) {
            try {
                setIsCheckingBusiness(true);
                const response = await dispatch(checkBusiness(landphone));
                if (response.payload) {
                    setBusinessData(response.payload)
                } else {
                    setBusinessData(null)
                }
                setIsCheckingBusiness(false);
            } catch (error) {
                setBusinessData(null)
                setIsCheckingBusiness(false);
                console.error('Error checking business:', error);
            }
        }
    }, 700);

    useEffect(() => {
        if (businessData) {
            setValue('name', businessData.name);
            setValue('route', businessData.location.route_id);
            setValue('location', businessData.location.id);
            setValue('address', businessData?.address);
            setValue('email', businessData?.email);
            setValue('location_url', businessData?.location_url);
            setValue('contact_name', businessData.contacts[0]?.name);
            setValue('contact_phone', businessData.contacts[0]?.phone_number);
        }
    }, [businessData, setValue]);

    // Inside your onSubmit function
    const onSubmit = async (data) => {
        try {
            if (!initialData) {
                const result = await dispatch(createLead(data));

                const uploadPromises = [];

                if (uppyVisitingCard.getFiles().length > 0) {
                    uppyVisitingCard.setMeta({
                        id: result.payload.id,
                        type: 'card',
                    });

                    const visitingCardUploadPromise = new Promise((resolve) => {
                        uppyVisitingCard.on('complete', async (file, response) => {
                            await dispatch(fetchLeads(initialFilterState));
                            resolve();
                        });

                        uppyVisitingCard.upload();
                    });

                    uploadPromises.push(visitingCardUploadPromise);
                }

                if (uppyStoreFront.getFiles().length > 0) {
                    uppyStoreFront.setMeta({
                        id: result.payload.id,
                        type: 'store-front',
                    });

                    const storeFrontUploadPromise = new Promise((resolve) => {
                        uppyStoreFront.on('complete', async (file, response) => {
                            await dispatch(fetchLeads(initialFilterState));
                            resolve();
                        });

                        uppyStoreFront.upload();
                    });

                    uploadPromises.push(storeFrontUploadPromise);
                }

                if (uploadPromises.length > 0) {
                    setIsUploading(true)
                    await Promise.all(uploadPromises);
                } else {
                    await dispatch(fetchLeads(initialFilterState));
                }
                onSuccess()
                handleClose();

            } else {
                const formData = {
                    id: initialData.id,
                    data: data
                }
                await dispatch(updateLead(formData));
                dispatch(fetchLeads(initialFilterState))
                onSuccess(true)
                handleClose()
            }
        } catch (error) {
            console.error('Error creating lead:', error);
        }
    };

    useEffect(() => {
        if (isDialogOpen) {
            dispatch(fetchServices())
            dispatch(fetchRoutes())
            dispatch(fetchLeadSources())
        }
    }, [isDialogOpen])

    const handleClose = () => {
        handleDialogClose();
        setBusinessData(null)
        setIsUploading(false)
        reset();
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            scroll={"body"}
            fullScreen={isMobile}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                {initialData ? 'Update Lead' : 'New Lead'}
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
            <DialogContent dividers sx={{padding: isMobile ? '0 0 8rem' : 0, width: isMobile ? '100%' : '60vw'}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    <Box sx={{
                        padding: isMobile ? 0 : '1.5rem',
                        width: '100%',
                        background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                    }}>

                        <Grid container spacing={2}>
                            <Grid item={true} xs={12} md={7}>
                                <Paper sx={{
                                    padding: '1.5rem',
                                    maxWidth: '100% !important',
                                }}>

                                    <Stack direction={"row"} gap={"0.5rem"}>
                                        <BusinessIcon/>
                                        <Typography sx={{fontWeight: '500', marginBottom: '0.5rem'}}
                                                    gutterBottom component={"h4"}>Student
                                            Info</Typography>
                                    </Stack>

                                    <Divider sx={{marginBottom: '1rem'}}/>

                                    <Stack direction={"column"}
                                           sx={{gap: '1.5rem', 'flex': 'none'}}>
                                        {/* Name */}
                                        <Stack direction={isMobile ? 'column' : "row"} sx={{gap: '1.5rem'}}>
                                            <Stack flex={1}>
                                                <Box sx={{position: 'relative'}}>
                                                    <Controller
                                                        name="landphone"
                                                        control={control}
                                                        defaultValue=""
                                                        render={({field}) => (
                                                            <TextField
                                                                {...field}
                                                                required
                                                                fullWidth
                                                                id="landphone"
                                                                label="Land phone Number"
                                                                name="landphone"
                                                                autoFocus
                                                                error={!!errors.landphone}
                                                                helperText={errors.landphone?.message}
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                    checkBusinessData(e.target.value);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {isCheckingBusiness &&
                                                        <Box sx={{position: 'absolute', right: '1rem', top: '1rem'}}>
                                                            <CircularProgress size={"1.5rem"}/>
                                                        </Box>
                                                    }
                                                </Box>
                                            </Stack>
                                            <Stack flex={1}>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            id="email"
                                                            label="Email Address (optional)"
                                                            name="email"
                                                            autoFocus
                                                            error={!!errors.email}
                                                            helperText={errors.email?.message}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </Stack>

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
                                                    label="Student Name"
                                                    name="name"
                                                    error={!!errors.name}
                                                    helperText={errors.name?.message}
                                                />
                                            )}
                                        />

                                        <Stack direction={isMobile ? 'column' : "row"}
                                               sx={{gap: '1.5rem'}}>
                                            {routes.length > 0 &&

                                                <>
                                                    <Stack flex={1}>
                                                        <Controller
                                                            name="route"
                                                            control={control}
                                                            defaultValue=""
                                                            render={({field}) => (
                                                                <TextField
                                                                    {...field}
                                                                    fullWidth
                                                                    required
                                                                    id="select-route"
                                                                    select
                                                                    label="Route"
                                                                >
                                                                    {routes.length === 0 &&
                                                                        <MenuItem value={""}></MenuItem>
                                                                    }
                                                                    {routes.map((route) => (
                                                                        <MenuItem key={route.id} value={route.id}>
                                                                            {route.name}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            )}
                                                        />
                                                        {errors.route && (
                                                            <Typography
                                                                sx={{
                                                                    color: 'red',
                                                                    fontSize: '.875rem'
                                                                }}>{errors.route.message}</Typography>
                                                        )}
                                                    </Stack>
                                                    <Stack flex={1}>
                                                        <Controller
                                                            name="location"
                                                            control={control}
                                                            defaultValue=""
                                                            render={({field}) => (
                                                                <TextField
                                                                    {...field}
                                                                    fullWidth
                                                                    required
                                                                    id="select-location"
                                                                    select
                                                                    label="Location"
                                                                >
                                                                    {!selectedRoute &&
                                                                        <MenuItem value={""}></MenuItem>
                                                                    }
                                                                    {selectedRoute &&
                                                                        routes
                                                                            .find((route) => route.id == selectedRoute)
                                                                            ?.locations.map((location) => (
                                                                            <MenuItem key={location.id}
                                                                                      value={location.id}>
                                                                                {location.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                </TextField>
                                                            )}
                                                        />
                                                        {errors.location && (
                                                            <Typography
                                                                sx={{
                                                                    color: 'red',
                                                                    fontSize: '.875rem'
                                                                }}>{errors.location.message}</Typography>
                                                        )}
                                                    </Stack>
                                                </>
                                            }
                                        </Stack>

                                        <Stack>
                                            <Controller
                                                name="address"
                                                control={control}
                                                defaultValue=""
                                                render={({field}) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        minRows={3}
                                                        multiline
                                                        id="address"
                                                        label="Address (optional)"
                                                        name="address"
                                                    />
                                                )}
                                            />
                                        </Stack>

                                        <Stack direction={"row"}
                                               sx={{gap: '1.5rem'}}>
                                            <Controller
                                                name="location_url"
                                                control={control}
                                                defaultValue=""
                                                render={({field}) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        placeholder={"Paste here"}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment
                                                                position="start"><LocationOnIcon/></InputAdornment>,
                                                        }}
                                                        multiline
                                                        id="location_url"
                                                        label="Location URL"
                                                        name="location_url"
                                                        type={"url"}
                                                        error={!!errors.location_url}
                                                        helperText={errors.location_url?.message}
                                                    />
                                                )}
                                            />
                                        </Stack>


                                        <Paper sx={{
                                            padding: '1rem',
                                            maxWidth: '100% !important',
                                            background: 'linear-gradient(180deg, #FFFBED 0%, rgba(255, 251, 237, 0.00) 100%)',
                                            border: '1px solid #A2A950',
                                        }}>

                                            <Stack direction={"row"} gap={"0.5rem"}>
                                                <RecentActorsIcon sx={{color: '#AB6C33'}}/>
                                                <Typography
                                                    sx={{fontWeight: '500', marginBottom: '0.5rem', color: '#AB6C33'}}
                                                    gutterBottom component={"h4"}>Contact Person</Typography>
                                            </Stack>

                                            <Stack direction={isMobile ? 'column' : "row"}
                                                   sx={{gap: isMobile ? '1rem' : '1.5rem'}}>
                                                {/* Name */}
                                                <Controller
                                                    name="contact_name"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            id="contact_name"
                                                            label="Name"
                                                            sx={{background: '#fff'}}
                                                            name="contact_name"
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="contact_phone"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            id="contact_phone"
                                                            label="Phone Number"
                                                            name="contact_phone"
                                                            sx={{background: '#fff'}}
                                                        />
                                                    )}
                                                />
                                            </Stack>

                                        </Paper>
                                        {!initialData &&

                                            <Paper sx={{
                                                padding: '1rem 1rem 2rem',
                                                maxWidth: '100% !important',
                                                background: 'linear-gradient(180deg, #EDFFF1 0%, rgba(237, 251, 255, 0.00) 100%);',
                                                border: '1px solid #7BC760',
                                            }}>

                                                <Stack direction={"row"} gap={"0.5rem"} sx={{marginBottom: '1rem'}}>
                                                    <PhotoLibraryIcon sx={{color: "#2D6115"}}/>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: '500',
                                                            marginBottom: '0.5rem',
                                                            color: '#2D6115'
                                                        }}
                                                        gutterBottom component={"h4"}>Business Images</Typography>
                                                </Stack>

                                                <Box sx={{height: '160px',}}
                                                     className={"uppy-second lead-uppy"}>
                                                    {CSRF &&
                                                        <>
                                                            <Typography className={"uppy-heading-text"}>Student Images</Typography>

                                                            <Dashboard uppy={uppyVisitingCard}
                                                                       hideUploadButton
                                                                       width={"100%"}
                                                                       height={"100%"}
                                                                       plugins={['FileInput']}
                                                                       proudlyDisplayPoweredByUppy={false}
                                                                       locale={{
                                                                           strings: {
                                                                               browseFiles: 'Browse a file',
                                                                               dropPasteFiles: 'Drop a file here or %{browseFiles}',
                                                                           }
                                                                       }}
                                                            />
                                                        </>
                                                    }
                                                </Box>

                                                <Box sx={{height: '160px', marginTop: '2rem'}}
                                                     className={"uppy-first lead-uppy"}>
                                                    {CSRF &&
                                                        <>
                                                            <Typography className={"uppy-heading-text"}>
                                                                Certificates</Typography>

                                                            <Dashboard uppy={uppyStoreFront}
                                                                       hideUploadButton
                                                                       width={"100%"}
                                                                       height={"100%"}
                                                                       plugins={['FileInput']}
                                                                       proudlyDisplayPoweredByUppy={false}
                                                                       locale={{
                                                                           strings: {
                                                                               browseFiles: 'Browse a file',
                                                                               dropPasteFiles: 'Drop a file here or %{browseFiles}',
                                                                           }
                                                                       }}
                                                            />
                                                        </>
                                                    }
                                                </Box>


                                            </Paper>
                                        }

                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid item={true} xs={12} md={5}>

                                <Stack direction={"column"} gap={"1.5rem"}>
                                    <Paper sx={{
                                        padding: '0rem',
                                        maxWidth: '100% !important',
                                    }}>
                                        <Stack direction={"column"}
                                               sx={{
                                                   gap: '1.5rem',
                                                   flex: 'none',
                                                   padding: '1.5rem',
                                                   alignSelf: 'stretch'
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
                                                    Select Services
                                                </Typography>
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
                                                    name="selectedServices"
                                                    control={control}
                                                    defaultValue={[]}
                                                    render={({field}) => (
                                                        <>
                                                            {!loading && services.length > 0 && services.map((service) => (
                                                                <Stack
                                                                    key={service.id}
                                                                    onClick={() => {
                                                                        // Toggle the selected service
                                                                        const isSelected = field.value.includes(service.id);
                                                                        if (isSelected) {
                                                                            field.onChange(field.value.filter((id) => id !== service.id));
                                                                        } else {
                                                                            field.onChange([...field.value, service.id]);
                                                                        }
                                                                    }}
                                                                    alignItems="center"
                                                                    direction="row"
                                                                    className={field.value.includes(service.id) ? 'active' : ''}
                                                                >
                                                                    <Stack alignItems="center" gap="0.5rem"
                                                                           direction="row">
                                                                        <ColorBox text={service.name}/>
                                                                        <Typography
                                                                            component="h5">{service.name}</Typography>
                                                                    </Stack>

                                                                    <div>
                                                                        {field.value.includes(service.id) ? (
                                                                            <CheckCircleIcon color="secondary"/>
                                                                        ) : (
                                                                            <RadioButtonUncheckedIcon
                                                                                sx={{fill: '#AFAFAF'}}/>
                                                                        )}
                                                                    </div>
                                                                </Stack>
                                                            ))}
                                                        </>
                                                    )}
                                                />


                                            </Stack>

                                            {errors.selectedServices && (
                                                <Typography
                                                    sx={{color: 'red'}}>{errors.selectedServices.message}</Typography>
                                            )}
                                        </Stack>


                                    </Paper>


                                    <Paper sx={{
                                        padding: '1.5rem',
                                        maxWidth: '100% !important',
                                    }}>

                                        <Typography
                                            component={"h4"}
                                            sx={{
                                                fontWeight: 500,
                                            }}
                                        >
                                            Lead Classification
                                        </Typography>

                                        <Box sx={{padding: '1rem 1rem 0'}}>
                                            <Controller
                                                name="lead_status"
                                                control={control}
                                                defaultValue={initialData ? initialData.lead_status : 0}
                                                render={({field}) => (
                                                    <Slider
                                                        value={field.value} // Use the value from the field
                                                        onChange={(event, newValue) => field.onChange(newValue)} // Update the field value when the slider changes
                                                        aria-label="Lead Classification"
                                                        min={0}
                                                        max={2}
                                                        step={1}
                                                        className={
                                                            field.value == 0
                                                                ? 'MuiSlider-thumbColorCold'
                                                                : field.value == 1
                                                                    ? 'MuiSlider-thumbColorWarm'
                                                                    : 'MuiSlider-thumbColorHot'
                                                        }
                                                        marks={[
                                                            {
                                                                value: 0,
                                                                label: 'Cold',
                                                            },
                                                            {
                                                                value: 1,
                                                                label: 'Warm',
                                                            },
                                                            {
                                                                value: 2,
                                                                label: 'Hot',
                                                            },
                                                        ]}
                                                    />
                                                )}
                                            />
                                        </Box>

                                    </Paper>


                                    <Paper sx={{
                                        padding: '1.5rem',
                                        maxWidth: '100% !important',
                                    }}>

                                        <Typography
                                            component={"h4"}
                                            sx={{
                                                fontWeight: 500,
                                            }}
                                        >
                                            Urgency
                                        </Typography>

                                        <Controller
                                            name="urgency"
                                            control={control}
                                            defaultValue={0}
                                            render={({field}) => (
                                                <Box display="flex" alignItems="center" gap={"1rem"} mt={"1rem"}>
                                                    <Typography variant="subtitle1">Low</Typography>
                                                    <Switch
                                                        color="error"
                                                        checked={field.value == 1} // Map the Controller value to the checked state of the Switch
                                                        onChange={(event) => field.onChange(event.target.checked ? 1 : 0)} // Update the Controller value when the Switch is toggled
                                                    />
                                                    <Typography variant="subtitle1">High</Typography>
                                                </Box>
                                            )}
                                        />

                                    </Paper>

                                    <Paper sx={{
                                        padding: '1.5rem',
                                        maxWidth: '100% !important',
                                    }}>

                                        <Stack gap={"1rem"}>
                                            {lead_sources.length > 0 &&
                                                <Stack>
                                                    <Typography
                                                        component={"h4"}
                                                        sx={{
                                                            fontWeight: 500,
                                                            marginBottom: '1rem'
                                                        }}
                                                    >
                                                        Lead Source (optional)
                                                    </Typography>
                                                    <Controller
                                                        name="lead_source_id"
                                                        control={control}
                                                        defaultValue=""
                                                        render={({field}) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                id="select-source"
                                                                select
                                                                label="Select a source"
                                                            >
                                                                {lead_sources.length === 0 &&
                                                                    <MenuItem value={""}></MenuItem>
                                                                }
                                                                {lead_sources.map((source) => (
                                                                    <MenuItem key={source.id} value={source.id}>
                                                                        {source.title}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        )}
                                                    />
                                                </Stack>
                                            }
                                            <Stack>
                                                <Typography
                                                    component={"h4"}
                                                    sx={{
                                                        fontWeight: 500,
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                    Notes (optional)
                                                </Typography>
                                                <Controller
                                                    name="note"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            id="note"
                                                            label="Enter extra notes here"
                                                            name="note"
                                                            autoFocus
                                                            multiline
                                                            minRows={3}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </Stack>

                                    </Paper>

                                </Stack>


                            </Grid>
                        </Grid>
                    </Box>
                    <Divider/>

                    <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>
                        {!initialData &&
                            <>
                                {isCreating || isUploading ? (
                                    <Button color="secondary" variant="contained" disabled
                                            size={isMobile ? "large" : ''}>
                                        <CircularProgress size={"1.5rem"}/>
                                    </Button>
                                ) : (
                                    <Button color="secondary" variant="contained" type={"submit"}
                                            size={isMobile ? "large" : ''}>
                                        Create Lead
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
                                        Update Lead
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
export default LeadFormDialog;