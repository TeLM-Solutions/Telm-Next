import * as yup from "yup";
import {dispatch} from '@/store';
import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {Button, CircularProgress, Stack, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {fetchRoutesSilent, updateLocation} from "@/store/slices/routesSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
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
    name: yup.string().required('Please enter location name'),
});
const LocationFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isLoading, setIsLoading] = useState(false);


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
        },
        values: {
            name: initialData?.name || "",
        }
    });

    // Inside your onSubmit function
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const formData = {
                routeId: initialData.route_id,
                locationId: initialData.id,
                locationData: data
            }
            await dispatch(updateLocation(formData));
            await dispatch(fetchRoutesSilent())
            handleClose()
            onSuccess()
        } catch (error) {
            console.error('Error updating location:', error);
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
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                Edit Location
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
                                    placeholder="Enter location name"
                                    autoFocus
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Stack>

                    <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>
                        {isLoading ? (
                            <Button color="secondary" variant="contained" disabled>
                                <CircularProgress size={"1.5rem"}/>
                            </Button>
                        ) : (
                            <Button color="secondary" variant="contained" type={"submit"}>
                                Update Location
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
export default LocationFormDialog;