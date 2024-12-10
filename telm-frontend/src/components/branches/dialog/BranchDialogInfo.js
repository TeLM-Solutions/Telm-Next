import {Alert, Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import UserAvatar from "@/components/common/UserAvatar";
import ColorBox from "@/components/common/ColorBox";

const BranchDialogInfo = ({branch, showManger = true, showBranch = false}) => {
    return (
        <>
            <Box sx={StyledPaper}>
                <Box className={"heading has-button"}>
                    <Typography>Branch Info</Typography>
                </Box>
                <Divider/>
                <Box className={"services"}>

                    <Stack direction={{
                        xs: "column",
                        md: "row"

                    }} gap={"3rem"}>

                        {showManger &&

                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Typography variant={"h5"}>Manager</Typography>
                                {branch.manager === null &&
                                    <Alert severity="warning">Not assigned</Alert>
                                }
                                {branch.manager !== null &&
                                    <Stack direction="row"
                                           alignItems="center"
                                           sx={{gap: '0.5rem'}}>
                                        <UserAvatar name={branch.manager.name}/>
                                        <Stack>
                                            <Typography>{branch.manager.name}</Typography>
                                        </Stack>
                                    </Stack>
                                }

                            </Stack>
                        }
                        {showBranch &&
                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Typography variant={"h5"}>Branch</Typography>
                                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                    <ColorBox text={branch.name}/>
                                    <Typography
                                        component={"h2"}
                                        sx={{color: '#000', fontSize: '1.125rem'}}
                                    >
                                        {branch.name}
                                    </Typography>
                                </Stack>
                            </Stack>

                        }

                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Typography variant={"h5"}>Address</Typography>
                            <Typography>{branch.address}</Typography>
                        </Stack>

                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Typography variant={"h5"}>Contact Number</Typography>
                            <Typography>{branch.contact_number}</Typography>
                        </Stack>

                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Typography variant={"h5"}>Email Address</Typography>
                            <Typography>{branch.email_address}</Typography>
                        </Stack>


                    </Stack>

                </Box>
            </Box>


        </>
    )
}

export default BranchDialogInfo;