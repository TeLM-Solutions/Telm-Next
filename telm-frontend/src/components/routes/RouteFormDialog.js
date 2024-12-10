import * as yup from "yup";
import {dispatch, useSelector} from '@/store';
import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Box, Button, CircularProgress, Divider, Stack, TextField, Typography} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {createRoute, fetchRoutesSilent, updateRoute} from "@/store/slices/routesSlice";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
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
    name: yup.string().required('Please enter route name'),
});
const RouteFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {

    const {isCreating, isUpdating} = useSelector((state) => state.routes);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // const [locations, setLocations] = useState(initialData?.locations || []);

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
            locations: initialData?.locations || [],
        },
        values: {
            name: initialData?.name || "",
            locations: initialData?.locations || [],
        }
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "locations",
    });

    // useEffect(() => {
    //     setLocations(initialData?.locations || []);
    // }, [initialData]);

    const addLocationField = () => {
        append({name: ""});
    };

    // Inside your onSubmit function
    const onSubmit = async (data) => {

        try {
            if (!initialData) {
                await dispatch(createRoute(data));
                await dispatch(fetchRoutesSilent());
                onSuccess()
            } else {
                const formData = {
                    id: initialData.id,
                    routeData: data
                }
                await dispatch(updateRoute(formData));
                onSuccess(true)
            }
            handleClose()
        } catch (error) {
            console.error('Error creating route:', error);
        }
    };

    const handleClose = () => {
        handleDialogClose();
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
                {initialData ? 'Update Route' : 'New Route'}
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
                           sx={{gap: "1.5rem", width: isMobile ? "100vw" : "37.5rem", flex: "none", padding: "1.5rem"}}>
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
                                    placeholder="Enter route name"
                                    autoFocus
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Stack>
                    {!initialData &&
                        <>
                            <Divider/>

                            <Box sx={{
                                background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                                padding: {
                                    xs: '1.5rem 1.5rem 10rem 1.5rem',
                                    md: '1.5rem'
                                }
                            }}>
                                <Stack direction="column" gap={"2rem"}>
                                    <Typography component={"h5"}>Locations</Typography>
                                    {/* Dynamic Location Fields */}
                                    <Stack>
                                        {fields.map((field, index) => (

                                            <Stack direction="row" gap={"1.5rem"} key={field.id}
                                                   sx={{
                                                       background: '#fff',
                                                       padding: '1rem',
                                                       boxShadow: '0 0 4px #ddd'
                                                   }}>
                                                <Controller
                                                    name={`locations[${index}].name`}
                                                    control={control}
                                                    defaultValue={field.location}
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            size={"small"}
                                                            label={`Location ${index + 1}`}
                                                            placeholder="Enter location"
                                                        />
                                                    )}
                                                />
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <HighlightOffOutlinedIcon/>
                                                </IconButton>
                                            </Stack>

                                        ))}
                                    </Stack>
                                    <Button variant="outlined" color="primary" onClick={addLocationField}>
                                        Add Location
                                    </Button>
                                </Stack>
                            </Box>
                            <Divider/>
                        </>
                    }


                    <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>

                        {!initialData &&
                            <>
                                {isCreating ? (
                                    <Button color="secondary" variant="contained" disabled>
                                        <CircularProgress size={"1.5rem"}/>
                                    </Button>
                                ) : (
                                    <Button color="secondary" variant="contained" type={"submit"}>
                                        Create Route
                                    </Button>
                                )}
                            </>
                        }
                        {initialData &&
                            <>
                                {isUpdating ? (
                                    <Button color="secondary" variant="contained" disabled>
                                        <CircularProgress size={"1.5rem"}/>
                                    </Button>
                                ) : (
                                    <Button color="secondary" variant="contained" type={"submit"}>
                                        Update Route
                                    </Button>
                                )}
                            </>
                        }
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </BootstrapDialog>
    )

}
export default RouteFormDialog;