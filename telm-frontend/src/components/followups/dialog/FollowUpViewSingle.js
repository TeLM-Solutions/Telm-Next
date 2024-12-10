import {Box, Divider, IconButton, Stack, Typography} from "@mui/material";
import {useAuth} from "@/hooks/auth";
import {dispatch} from "@/store";
import {changeStatusFollowUp, fetchAFollowUp} from "@/store/slices/followupSlice";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {StyledPaper} from "@/styles/styles";
import React, {useState} from "react";
import FollowUpStatusChip from "@/components/followups/shared/FollowUpStatusChip";
import FollowupChangeStatus from "@/components/followups/dialog/FollowupChangeStatus";
import {dateFormat} from "@/lib/relativeTime";
import FollowupContactType from "@/components/followups/shared/FollowupContactType";
import {publish} from "@/lib/events";
import Icon from "@/components/common/Icon";
import EditIcon from "../../../../public/images/icons/edit.svg";

const FollowUpViewSingle = ({followup, emit = false, showEdit = false, onClickEdit, job_status = null}) => {
    const {user} = useAuth({middleware: 'auth'})

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isLoading, setIsLoading] = useState(false)


    const handleStatusChange = async (status) => {
        setIsLoading(true)
        const data = {id: followup.id, status: status};
        await dispatch(changeStatusFollowUp(data));
        if (!emit) {
            await dispatch(fetchAFollowUp(followup.job_id));
            publish('reload_followups_table');
            setIsLoading(false)
        } else {
            publish('followup_status_updated');
            publish('followup_edit_completed');
            publish('reload_followups_table');
        }
    }

    return (
        <>
            <Box sx={StyledPaper}>
                <Box className={"services"}>
                    <Stack direction="row" gap={{
                        xs: '1rem',
                        md: '5rem'
                    }} justifyContent={"space-between"}>
                        <Stack direction={"column"} gap={"0.5rem"} pb={"1rem"}>
                            <Typography variant={"h5"}>Status</Typography>
                            <FollowUpStatusChip status={followup.status}/>
                        </Stack>

                        {showEdit &&

                            <Stack>
                                {user.role === 'executive' && job_status == 1 &&
                                    <>
                                        <IconButton aria-label="view" size="large"
                                                    onClick={() => onClickEdit(followup.id)}>
                                            <Icon src={EditIcon} height={20} width={21}/>
                                        </IconButton>
                                    </>
                                }
                                {user.role === 'manager' && job_status == 1 && followup.user_id == user.id &&
                                    <IconButton aria-label="view" size="large"
                                                onClick={() => onClickEdit(followup.id)}>
                                        <Icon src={EditIcon} height={20} width={21}/>
                                    </IconButton>
                                }
                            </Stack>
                        }
                    </Stack>

                    <Divider/>
                    <Box className={"services"}>
                        <Stack direction={{
                            xs: 'column',
                            md: 'row'
                        }} gap={{
                            xs: '1rem',
                            md: '5rem'
                        }} pt={"1rem"}>

                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Typography variant={"h5"}>Reason</Typography>
                                <Typography>{followup.reason.title}</Typography>
                            </Stack>
                            {isMobile && <Divider/>}
                            <Stack direction={{
                                xs: 'row',
                            }} gap={{
                                xs: '3rem',
                                md: '5rem'
                            }}>
                                <Stack direction={"column"} gap={"0.5rem"}>
                                    <Typography variant={"h5"}>Date</Typography>
                                    <Typography>{dateFormat(followup.date, false, true)}</Typography>
                                </Stack>
                                {followup.time &&
                                    <Stack direction={"column"} gap={"0.5rem"}>
                                        <Typography variant={"h5"}>Time</Typography>
                                        <Typography>{followup.time}</Typography>
                                    </Stack>
                                }
                            </Stack>

                            {followup.contact_type &&
                                <>
                                    {isMobile && <Divider/>}
                                    <Stack gap={"0.5rem"}>
                                        <Typography variant={"h5"}>Contact Type</Typography>
                                        <FollowupContactType type={followup.contact_type}/>
                                    </Stack>
                                </>
                            }

                        </Stack>

                        {followup.status === 1 &&
                            <Stack direction={"column"} gap={"0.5rem"} pt={"2rem"}>
                                {user.role === 'executive' && followup.status == 1 &&
                                    <FollowupChangeStatus handleStatusChange={handleStatusChange}
                                                          isLoading={isLoading}/>
                                }
                                {user.role === 'manager' && followup.status == 1 && user.id == followup.user_id &&
                                    <FollowupChangeStatus handleStatusChange={handleStatusChange}
                                                          isLoading={isLoading}/>
                                }
                            </Stack>
                        }


                    </Box>
                </Box>
            </Box>


        </>
    )
}
export default FollowUpViewSingle;