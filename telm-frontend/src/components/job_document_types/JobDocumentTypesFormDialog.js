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
import useMediaQuery from "@mui/material/useMediaQuery";
import {
    createJobDocumentType,
    fetchJobDocumentTypes,
    updateJobDocumentType
} from "@/store/slices/jobDocumentTypesSlice";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const validationSchema = yup.object().shape({
    title: yup.string().required('Please enter title'),
});
const JobDocumentTypesFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {isCreating, isUpdating} = useSelector((state) => state.jobDocumentTypes);

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: initialData?.title || "",
        },
        values: {
            title: initialData?.title || "",
        }
    });

    // Inside your onSubmit function
    const onSubmit = async (data) => {
        try {
            if (!initialData) {
                await dispatch(createJobDocumentType(data));
                await dispatch(fetchJobDocumentTypes())
                handleClose()
                onSuccess()
            } else {
                const formData = {
                    id: initialData.id,
                    data: data
                }
                await dispatch(updateJobDocumentType(formData));
                handleClose()
                onSuccess(true)
            }
        } catch (error) {
            console.error('Error creating record:', error);
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
                {initialData ? 'Update' : 'New'}
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
                            name="title"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    name="title"
                                    placeholder="Enter title"
                                    autoFocus
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
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
                                        Create
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
                                        Update
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
export default JobDocumentTypesFormDialog;