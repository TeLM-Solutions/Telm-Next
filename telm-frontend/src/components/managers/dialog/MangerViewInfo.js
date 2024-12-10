import {Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import UserAvatar from "@/components/common/UserAvatar";
import {dateFormat} from "@/lib/relativeTime";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ManagerViewInfo = ({manager, title = 'Manager Info'}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <>
            <Box sx={StyledPaper}>
                <Box className={"heading has-button"}>
                    <Typography>{title}</Typography>
                </Box>
                <Divider/>
                <Box className={"services"}>

                    <Stack gap={"2rem"}>
                        <Stack direction={{
                            sx: 'column',
                            md: 'row'
                        }} gap={"3rem"}>

                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Typography variant={"h5"}>Name</Typography>
                                <Stack direction="row"
                                       alignItems="center"
                                       sx={{gap: '0.5rem'}}>
                                    <UserAvatar name={manager.name}/>
                                    <Typography varient={"body2"}
                                                sx={{fontSize: '1rem'}}>{manager.name}</Typography>
                                </Stack>
                            </Stack>

                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Typography variant={"h5"}>Contact Number</Typography>
                                <Typography>{manager.contact_number}</Typography>
                            </Stack>

                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Typography variant={"h5"}>Email Address</Typography>
                                <Typography>{manager.email}</Typography>
                            </Stack>

                            {manager.gender &&

                                <Stack direction={"column"} gap={"0.5rem"}>
                                    <Typography variant={"h5"}>Gender</Typography>
                                    <Typography sx={{textTransform: 'capitalize'}}>{manager.gender}</Typography>
                                </Stack>
                            }


                        </Stack>

                        <Stack direction={"row"} gap={"3rem"}>

                            {manager.address &&

                                <Stack direction={"column"} gap={"0.5rem"}>
                                    <Typography variant={"h5"}>Address</Typography>
                                    <Typography>{manager.address}</Typography>
                                </Stack>
                            }


                        </Stack>

                        {manager.join_date &&
                            <Stack direction={"row"} gap={"3rem"}>
                                <Stack direction={"column"} gap={"0.5rem"}>
                                    <Typography variant={"h5"}>Join Date</Typography>
                                    <Typography>{dateFormat(manager.join_date, false)}</Typography>
                                </Stack>
                            </Stack>
                        }
                    </Stack>

                </Box>
            </Box>


        </>
    )
}

export default ManagerViewInfo;