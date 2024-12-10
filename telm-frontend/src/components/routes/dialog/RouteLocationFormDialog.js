import {dispatch, useSelector} from "@/store";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import * as yup from "yup";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {createRouteLocations, fetchRoutesSilent} from "@/store/slices/routesSlice";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Box, Button, CircularProgress, Divider, Stack, TextField, Typography} from "@mui/material";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import DialogActions from "@mui/material/DialogActions";
import {useState} from "react";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const validationSchema = yup.object().shape({
    locations: yup
        .array()
        .of(
            yup.object().shape({
                name: yup.string().required('Location is required'), // Customize the error message as needed
            })
        )
        .required('At least one location is required'), // Customize the error message as needed
});

const RouteLocationFormDialog = ({route, isDialogOpen, handleDialogClose, onSuccess}) => {

    const {isCreatingLocations} = useSelector((state) => state.routes);
    const [initialLocation, setInitialLocation] = useState({name: ''});

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "locations",
    });

    const addLocationField = () => {
        append({name: ""});
    };

    const onSubmit = async (data) => {
        try {
            data.id = route.id;
            await dispatch(createRouteLocations(data));
            await dispatch(fetchRoutesSilent())
            handleClose()
            onSuccess();
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
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                Add Locations to {route?.name}
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
            <DialogContent dividers sx={{padding: 0, width: '30vw'}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    <Box sx={{
                        background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                        padding: '1.5rem'
                    }}>
                        <Stack direction="column" gap={'2rem'}>
                            {/* Dynamic Location Fields */}
                            <Stack>
                                {/* Show the initial location field */}
                                <Stack
                                    direction="row"
                                    gap={'1.5rem'}
                                    sx={{background: '#fff', padding: '1rem', boxShadow: '0 0 4px #ddd'}}
                                >
                                    <Controller
                                        name={`locations[0].name`}
                                        control={control}
                                        defaultValue={initialLocation.name}
                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                size={'small'}
                                                label={`Location 1`}
                                                placeholder="Enter location"
                                            />
                                        )}
                                    />
                                    <IconButton color="error" onClick={() => remove(0)}>
                                        <HighlightOffOutlinedIcon/>
                                    </IconButton>
                                </Stack>

                                {/* Dynamic Location Fields */}
                                {fields.slice(1).map((field, index) => (
                                    <Stack
                                        direction="row"
                                        gap={'1.5rem'}
                                        key={field.id}
                                        sx={{background: '#fff', padding: '1rem', boxShadow: '0 0 4px #ddd'}}
                                    >
                                        <Controller
                                            name={`locations[${index + 1}].name`}
                                            control={control}
                                            defaultValue={field.location}
                                            render={({field}) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    size={'small'}
                                                    label={`Location ${index + 2}`}
                                                    placeholder="Enter location"
                                                />
                                            )}
                                        />
                                        <IconButton color="error" onClick={() => remove(index + 1)}>
                                            <HighlightOffOutlinedIcon/>
                                        </IconButton>
                                    </Stack>
                                ))}
                                <Divider/>
                                <Box sx={{padding: '1rem', background: '#fff'}}>
                                    <Button sx={{width: 'fit-content'}} variant="outlined" color="primary"
                                            onClick={addLocationField}>
                                        Add More
                                    </Button>

                                    {errors.locations && (
                                        <Typography
                                            sx={{
                                                color: 'red',
                                                fontSize: '.875rem'
                                            }}>{errors.locations.message}</Typography>
                                    )}
                                </Box>
                            </Stack>

                        </Stack>
                    </Box>
                    <Divider/>


                    <DialogActions>
                        {isCreatingLocations ? (
                            <Button
                                color="secondary" variant="contained" disabled>
                                <CircularProgress size={"1.5rem"}/>
                            </Button>
                        ) : (
                            <Button
                                color="secondary" variant="contained" type={"submit"}>
                                Add Locations
                            </Button>
                        )}
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </BootstrapDialog>
    )

}

export default RouteLocationFormDialog;