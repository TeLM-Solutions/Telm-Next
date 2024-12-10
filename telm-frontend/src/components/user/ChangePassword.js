import * as yup from "yup";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {dispatch} from "@/store";
import {changePassword} from "@/store/slices/dashboardSlice";
import {Box, Button, Card, CircularProgress, Divider, IconButton, Stack, TextField, Typography} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Snack from "@/components/common/Snack";

const validationSchema = yup.object().shape({
    current_password: yup.string().required('Please enter the current password'),
    new_password: yup.string()
        .required('Please enter the new password')
        .min(8, 'Password must be at least 8 characters long'),
    confirm_password: yup.string()
        .required('Please enter the confirm password')
        .oneOf([yup.ref('new_password'), null], 'Passwords must match')
        .min(8, 'Password must be at least 8 characters long'),
});
const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // snackbar
    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {

        try {
            setErrorMessage(null);
            setIsLoading(true)
            const result = await dispatch(changePassword(data));

            if (changePassword.rejected.match(result)) {
                const errorData = result.payload.message;
                // console.log(errorData)
                if (errorData) {
                    setErrorMessage(errorData);
                    setIsLoading(false)
                }
                console.log('Validation error:', errorData.message);
            } else {
                setShowSnack(true)
                setSnackMessage('Password updated successfully')
                setIsLoading(false)
                reset();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <Card sx={{width: '100%'}}>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    position: 'relative'
                }}
            >

                <Box sx={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <Typography
                        sx={{
                            color: 'rgba(0, 0, 0, 0.87)',
                            fontSize: '1.5rem',
                            lineHeight: '1.8525rem',
                            letterSpacing: '0.01563rem'
                        }}
                        component="h1">
                        Change Password
                    </Typography>
                </Box>

            </Box>

            <Divider/>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack direction={"column"}
                       sx={{
                           width: {
                               xs: '100%',
                               md: '400px'
                           },
                           gap: '1.5rem',
                           padding: '1.5rem'
                       }}>
                    <Controller
                        name="current_password"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="current_password"
                                label="Current Password"
                                type={showPassword ? "text" : "password"} // Use state to toggle type
                                name="current_password"
                                placeholder="Enter current password"
                                autoFocus
                                error={!!errors.current_password || errorMessage}
                                helperText={errors.current_password?.message || errorMessage}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Divider/>


                    <Controller
                        name="new_password"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="new_password"
                                label="New Password"
                                type={showNewPassword ? "text" : "password"} // Use state to toggle type
                                name="new_password"
                                placeholder="Enter new password"
                                autoFocus
                                error={!!errors.new_password}
                                helperText={errors.new_password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                edge="end"
                                            >
                                                {showNewPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="confirm_password"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id="confirm_password"
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"} // Use state to toggle type
                                name="confirm_password"
                                placeholder="Enter confirm password"
                                autoFocus
                                error={!!errors.confirm_password}
                                helperText={errors.confirm_password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                    {isLoading &&
                        <Button color="secondary" variant="contained" disabled size={"large"}>
                            <CircularProgress size={"1.5rem"}/>
                        </Button>
                    }
                    {!isLoading &&
                        <Button color="secondary" variant="contained" type={"submit"} size={"large"}>
                            Change Password
                        </Button>
                    }


                </Stack>
            </form>
            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>

        </Card>
    )
}
export default ChangePassword