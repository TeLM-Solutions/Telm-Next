import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {Box, Button, CircularProgress, MenuItem, Paper, Stack, Switch, TextField, Typography} from "@mui/material";
import * as yup from "yup";
import {useDispatch} from "@/store";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import InputAdornment from "@mui/material/InputAdornment";
import DialogActions from "@mui/material/DialogActions";
import {useState} from "react";
import {updateLeadService} from "@/store/slices/leadSlice";
import useMediaQuery from "@mui/material/useMediaQuery";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const validationSchema = yup.object().shape({});
const LeadServiceEditDialog = ({service, isDialogOpen, handleDialogClose}) => {

    const [isSaving, setIsSaving] = useState(false);

    const dispatch = useDispatch();

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
            status: service?.pivot?.status === 0 ? 0 : 1,
            price_from: service?.pivot?.price_from ? removeDecimalIfZero(service?.pivot?.price_from) : '',
            price_to: service?.pivot?.price_from ? removeDecimalIfZero(service?.pivot?.price_to) : '',
            incentive_amount: service?.pivot?.incentive_amount ? removeDecimalIfZero(service?.pivot?.incentive_amount) : '',
            incentive_type: service?.pivot?.incentive_type || 'cash',
        },
        values: {
            status: service?.pivot?.status === 0 ? 0 : 1,
            price_from: service?.pivot?.price_from ? removeDecimalIfZero(service?.pivot?.price_from) : '',
            price_to: service?.pivot?.price_from ? removeDecimalIfZero(service?.pivot?.price_to) : '',
            incentive_amount: service?.pivot?.incentive_amount ? removeDecimalIfZero(service?.pivot?.incentive_amount) : '',
            incentive_type: service?.pivot?.incentive_type || 'cash',
        }
    });

    function removeDecimalIfZero(num) {
        const formattedNum = parseFloat(num).toFixed(2); // Ensure two decimal places
        return formattedNum.endsWith('.00') ? formattedNum.slice(0, -3) : formattedNum;
    }

    const onSubmit = async (data) => {
        try {
            setIsSaving(true);
            data.service_id = service.id;
            const formData = {
                id: service.pivot.lead_id,
                data: data
            }
            dispatch(updateLeadService(formData)).finally((d) => {
                setIsSaving(false);
                handleClose();
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleClose = () => {
        reset();
        handleDialogClose();
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            fullScreen={isMobile}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                Edit {service.name}
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
            <DialogContent dividers sx={{padding: 0, position: 'relative'}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack sx={{width: isMobile ? '100vw' : '30vw'}}>

                        <Stack direction="column"
                               alignItems="start"
                               sx={{flex: 1}}
                        >
                            <Stack direction={"column"}
                                   sx={{gap: '1.5rem'}}>

                                <Box sx={{padding: '1.5rem 1.5rem 0'}}>
                                    <Typography
                                        component={"h4"}
                                        sx={{
                                            fontWeight: 500,
                                        }}
                                    >
                                        Service Status
                                    </Typography>
                                    <Controller
                                        name="status"
                                        control={control}
                                        defaultValue={0}
                                        render={({field}) => (
                                            <Box display="flex" alignItems="center" gap={"1rem"} mt={"1rem"}
                                                 sx={{
                                                     background: field.value === 1 ? 'linear-gradient(300deg, #9cffc1, transparent)' : 'linear-gradient(89deg, #ffab9c, transparent)',
                                                     padding: '0.2rem 1rem',
                                                     borderRadius: '0.5rem',
                                                     width: 'fit-content',
                                                     border: field.value === 1 ? '1px solid #2c9d32' : '1px solid #9d2c2c'
                                                 }}

                                            >
                                                <Typography variant="subtitle1"
                                                            sx={{fontWeight: field.value === 0 ? '700' : '400'}}>Closed</Typography>
                                                <Switch
                                                    color="success"
                                                    checked={field.value === 1} // Map the Controller value to the checked state of the Switch
                                                    onChange={(event) => field.onChange(event.target.checked ? 1 : 0)} // Update the Controller value when the Switch is toggled
                                                />
                                                <Typography variant="subtitle1"
                                                            sx={{fontWeight: field.value === 1 ? '700' : '400'}}>Open</Typography>
                                            </Box>
                                        )}
                                    />
                                </Box>

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


                                    <Paper>

                                        <Stack direction={"column"}
                                               sx={{
                                                   gap: '1.5rem',
                                                   width: '100%',
                                                   padding: '1rem'

                                               }}
                                        >
                                            <Typography
                                                component={"h4"}
                                                sx={{
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Price Range
                                            </Typography>

                                            <Stack direction="row"
                                                   alignItems="center"
                                                   sx={{
                                                       gap: '1.5rem',
                                                   }}
                                            >
                                                {/* Contact Number */}
                                                <Controller
                                                    name={`price_from`}
                                                    control={control}
                                                    defaultValue=""
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            required
                                                            fullWidth
                                                            id={`price_from`}
                                                            label="Price From"
                                                            name={`price_from`}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment
                                                                        position="start">AED</InputAdornment>
                                                                ),
                                                            }}
                                                            error={!!errors.price_from}
                                                            helperText={errors.price_from?.message}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name={`price_to`}
                                                    control={control}
                                                    defaultValue=""
                                                    render={({field}) => (
                                                        <TextField
                                                            {...field}
                                                            required
                                                            fullWidth
                                                            id={`price_to`}
                                                            label="Price To"
                                                            name={`price_to`}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment
                                                                        position="start">AED</InputAdornment>
                                                                ),
                                                            }}
                                                            error={!!errors.price_to}
                                                            helperText={errors.price_to?.message}
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        </Stack>

                                    </Paper>

                                    <Paper sx={{maxWidth: '100% !important'}}>

                                        <Stack direction={"column"}
                                               sx={{
                                                   gap: '1.5rem',
                                                   width: '100%',
                                                   padding: '1rem'

                                               }}
                                        >
                                            <Typography
                                                component={"h4"}
                                                sx={{
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Incentive
                                            </Typography>

                                            <Stack direction="row"
                                                   alignItems="center"
                                                   sx={{
                                                       gap: '1.5rem',
                                                   }}
                                            >
                                                {/* Contact Number */}
                                                <Stack flex={1}>
                                                    <Controller
                                                        name="incentive_amount"
                                                        control={control}
                                                        defaultValue=""
                                                        render={({field}) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                id={'incentive_amount'}
                                                                label="Incentive Amount or Percentage"
                                                                name={'incentive_amount'}
                                                            />
                                                        )}
                                                    />
                                                </Stack>
                                                <Stack flex={0.3}>
                                                    <Controller
                                                        name="incentive_type"
                                                        control={control}
                                                        defaultValue="cash"
                                                        render={({field}) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                sx={{background: '#fff'}}
                                                                id="select-incentive_type"
                                                                select
                                                                defaultValue="cash"
                                                            >
                                                                <MenuItem key={"cash"} value={"cash"}>
                                                                    AED
                                                                </MenuItem>
                                                                <MenuItem key={"percentage"} value={"percentage"}>
                                                                    %
                                                                </MenuItem>
                                                            </TextField>
                                                        )}
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Stack>

                                    </Paper>

                                </Stack>


                            </Stack>
                        </Stack>

                    </Stack>
                    <DialogActions className={isMobile ? 'fixed-bottom-actions' : ''}>
                        {isSaving ? (
                            <Button color="secondary" variant="contained" disabled>
                                <CircularProgress size={"1.5rem"}/>
                            </Button>
                        ) : (
                            <Button color="secondary" variant="contained" type={"submit"}>
                                Update Service
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
export default LeadServiceEditDialog;