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
import {Button, CircularProgress, Stack, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {createService, fetchServices, updateService} from "@/store/slices/serviceSlice";
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
    name: yup.string().required('Please enter service name'),
});
const ServiceFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {

    const {isCreating, isUpdating} = useSelector((state) => state.services);
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
        },
        values: {
            name: initialData?.name || "",
        }
    });

    // Inside your onSubmit function
    const onSubmit = async (data) => {
        try {
            if (!initialData) {
                await dispatch(createService(data));
                dispatch(fetchServices())
                handleClose()
                onSuccess()
            } else {
                const formData = {
                    id: initialData.id,
                    data: data
                }
                await dispatch(updateService(formData));
                handleClose()
                onSuccess(true)

            }
        } catch (error) {
            console.error('Error creating service:', error);
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
                New Service
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
                                    placeholder="Enter service name"
                                    autoFocus
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />


                    </Stack>

                    <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>

                        {!initialData &&
                            <>
                                {isCreating ? (
                                    <Button color="secondary" variant="contained" disabled>
                                        <CircularProgress size={"1.5rem"}/>
                                    </Button>
                                ) : (
                                    <Button color="secondary" variant="contained" type={"submit"}>
                                        Create Service
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
                                        Update Service
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
export default ServiceFormDialog;