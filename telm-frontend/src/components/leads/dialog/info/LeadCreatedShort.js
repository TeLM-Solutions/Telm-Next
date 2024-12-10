import {Box, Chip, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '../../../../styles/styles';
import UserAvatar from "@/components/common/UserAvatar";
import {dateFormat} from "@/lib/relativeTime";
import {EventAvailable} from "@mui/icons-material";
import {useAuth} from "@/hooks/auth";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import React from "react";
import ColorBox from "@/components/common/ColorBox";
import LeadStatusSlide from "@/components/leads/shared/LeadStatusSlide";

const LeadCreatedShort = ({user, created_at, note, status, classification, lead_source = null}) => {
    const {user: loggedUser} = useAuth({middleware: 'auth'})
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading"}>
                <Typography>Other Info</Typography>
            </Box>
            <Divider/>
            <Box className={"services"}>

                <Stack direction="row" gap={{
                    xs: '2rem',
                    md: '3rem'
                }} sx={{marginBottom: '1rem', paddingBottom: '1rem'}}>
                    <Stack direction={"column"} gap={"0.5rem"}>
                        <Typography variant={"h5"}>Lead Status</Typography>
                        <LeadStatusChip status={status}/>
                    </Stack>
                    <Stack direction={"column"} gap={"0.5rem"}>
                        <Typography variant={"h5"}>Lead Classification</Typography>
                        <LeadStatusSlide lead_status={classification}/>
                    </Stack>
                    {lead_source &&
                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Typography variant={"h5"}>Lead Source</Typography>
                            <Chip variant={"outlined"} sx={{fontSize: '1rem'}} color={"primary"}
                                  label={lead_source.title}/>

                        </Stack>
                    }
                </Stack>

                {note &&
                    <Stack direction={"column"} gap={"0.5rem"} sx={{marginBottom: '1rem', paddingBottom: '1rem'}}>
                        <Typography variant={"h5"}>Notes</Typography>
                        <Typography>{note}</Typography>
                    </Stack>
                }

                <Stack direction={{
                    xs: 'column',
                    md: 'row'
                }} gap={{
                    xs: '1rem',
                    md: '5rem'
                }}>

                    {loggedUser.role === 'admin' && user.branches &&

                        <>
                            {
                                user.branches.length > 0 &&
                                <Stack direction={"column"} gap={"0.5rem"}>
                                    <Typography variant={"h5"}>Branch</Typography>
                                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                        <ColorBox text={user.branches[0].name}/>
                                        <Typography
                                            component={"h2"}
                                            sx={{color: '#000', fontSize: '1rem'}}
                                        >
                                            {user.branches[0].name}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            }
                        </>

                    }

                    <Stack direction={"column"} gap={"0.5rem"}>
                        <Typography variant={"h5"}>Lead Created By</Typography>
                        <Stack direction="row"
                               alignItems="center"
                               sx={{gap: '0.5rem'}}>
                            <UserAvatar name={user.name}/>
                            <Stack>
                                <Typography>{user.name}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={"column"} gap={"0.5rem"}>
                        <Typography variant={"h5"}>Created Date</Typography>
                        <Chip icon={<EventAvailable fontSize={"tiny"}/>}
                              sx={{fontSize: '0.85rem', paddingLeft: '0.5rem', width: 'fit-content'}}
                              variant={"outlined"}
                              label={dateFormat(created_at, false)}/>
                    </Stack>
                </Stack>

            </Box>
        </Box>
    )
}

export default LeadCreatedShort;