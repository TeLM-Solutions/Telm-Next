import {Alert, AlertTitle, Box, Button, Chip, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '../../../../styles/styles';
import {
    ArrowRightOutlined,
    DoneAllOutlined,
    EventAvailable,
    LockOutlined,
    PersonAddAlt1Outlined
} from "@mui/icons-material";
import UserAvatar from "@/components/common/UserAvatar";
import {dateFormat} from "@/lib/relativeTime";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import {useAuth} from "@/hooks/auth";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ColorBox from "@/components/common/ColorBox";
import {useState} from "react";
import LeadJobCloseConfirmDialog from "@/components/leads/dialog/info/LeadJobCloseConfirmDialog";
import {dispatch} from "@/store";
import {fetchAJob, updateJobStatus} from "@/store/slices/jobSlice";
import {fetchALead} from "@/store/slices/leadSlice";
import {publish} from "@/lib/events";

const LeadJobShort = ({job, showMore = true, onClickMore, services = [], canAssign = true}) => {
    const {user} = useAuth({middleware: 'auth'})

    const filteredServices = services.length > 0 ? services.filter((service) => service.pivot.status == 1) : [];

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    const handleConfirmClickOpen = () => {
        if (filteredServices.length === 0) {
            setOpenConfirmDialog(true);
        }
    };

    const handleConfirmClose = () => {
        setOpenConfirmDialog(false);
    };

    const confirmJobStatusChange = async () => {
        setIsStatusUpdating(true);
        const data = {
            id: job.id,
            status: 0
        }
        await dispatch(updateJobStatus(data));
        await dispatch(fetchALead(job.lead_id));
        await dispatch(fetchAJob(job.id));

        publish('reload_jobs_table')
        publish('followup_edit_completed')
        publish('job_created_from_lead_view')

        setIsStatusUpdating(false);
        setOpenConfirmDialog(false);
    }

    return (
        <Box sx={{
            ...StyledPaper,
        }}>
            <Box className={"heading has-button"}>
                <Typography>Job Info</Typography>
                {job !== null && showMore &&
                    <Button onClick={onClickMore} color={"info"} size={"small"} variant={"text"}
                            endIcon={<ArrowRightOutlined/>}>View
                        More</Button>
                }
            </Box>
            <Divider/>
            <Box className={"services"}>

                {job === null &&
                    <Stack direction={"row"} gap={"1rem"}>
                        <Alert severity="warning">Not assigned</Alert>
                        {canAssign &&
                            <Button onClick={onClickMore} variant={"outlined"} startIcon={<PersonAddAlt1Outlined/>}>Assign
                                Job</Button>
                        }
                    </Stack>


                }
                {job !== null &&
                    <Stack direction={{
                        xs: 'column',
                        md: "row"
                    }} gap={{
                        xs: '2rem',
                        md: '5rem'
                    }} sx={{paddingBottom: '1rem'}}>

                        <Stack direction={"column"} gap={"0.5rem"}>

                            <Typography variant={"h5"}>Job Assigned To</Typography>
                            <Stack direction="row"
                                   alignItems="center"
                                   sx={{gap: '0.5rem'}}>
                                <UserAvatar name={job.user.name}/>
                                <Stack>
                                    <Typography>{job.user.name}</Typography>
                                </Stack>
                            </Stack>

                        </Stack>

                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Typography variant={"h5"}>Job Assigned Date</Typography>
                            <Chip icon={<EventAvailable fontSize={"tiny"}/>}
                                  sx={{fontSize: '0.85rem', paddingLeft: '0.5rem', width: 'fit-content'}}
                                  variant={"outlined"}
                                  label={dateFormat(job.created_at, false)}/>
                        </Stack>

                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Typography variant={"h5"}>Start & End Date</Typography>
                            <JobStartEndDateProgress job_status={job.status} start_date={job.start_date}
                                                     end_date={job.end_date}/>
                        </Stack>


                    </Stack>
                }

            </Box>
            {job !== null &&
                <>
                    {job.status == 1 && user.role === 'manager' &&
                        <>
                            <Divider/>
                            <Stack direction={{
                                xs: "column",
                                md: 'row'
                            }} gap={"1rem"}
                                   sx={{padding: '1rem', background: 'linear-gradient(179deg, #fff6e0, transparent)'}}>
                                <Button sx={{width: 'fit-content', height: 'fit-content'}}
                                        disabled={filteredServices.length !== 0}
                                        variant="contained"
                                        size="large"
                                        onClick={handleConfirmClickOpen}
                                        startIcon={filteredServices.length !== 0 ? <LockOutlined/> :
                                            <DoneAllOutlined/>}>
                                    Close Job
                                </Button>
                                <Divider orientation="vertical" flexItem/>
                                {filteredServices.length !== 0 &&
                                    <Stack gap={"1rem"}>

                                        <Stack direction={"row"} gap={"0.5rem"}>
                                            <InfoOutlinedIcon color={"warning"}/>
                                            <Typography sx={{fontWeight: 500}}>The following services must be closed in
                                                order to
                                                close this job</Typography>
                                        </Stack>
                                        <Stack direction={"row"} flexWrap={"wrap"} gap={"0.5rem"}>
                                            {filteredServices.map((service, index) => (
                                                <Chip variant={"outlined"}
                                                      key={index}
                                                      label={<Stack direction={"row"} gap={"0.5rem"}
                                                                    alignItems={"center"}>
                                                          <ColorBox text={service.name}/>
                                                          <Typography
                                                              sx={{
                                                                  wordWrap: 'wrap',
                                                                  fontSize: '0.875rem'
                                                              }}>{service.name}</Typography>
                                                      </Stack>}/>
                                            ))}

                                        </Stack>

                                    </Stack>
                                }
                            </Stack>
                            <LeadJobCloseConfirmDialog handleClose={handleConfirmClose} open={openConfirmDialog}
                                                       isStatusUpdating={isStatusUpdating}
                                                       handleConfirm={confirmJobStatusChange}/>
                        </>
                    }
                    {job.status == 0 &&
                        <>
                            <Divider/>

                            <Stack direction={{
                                xs: 'column',
                                md: 'row'
                            }} gap={{
                                xs: '1rem',
                                md: '2rem'
                            }}
                                   sx={{padding: '1rem', background: 'linear-gradient(179deg, #cfffed, transparent)'}}>
                                <Alert sx={{background: '#fff'}} variant="outlined" severity="success">

                                    <AlertTitle>Job is closed</AlertTitle>
                                    Closed on {dateFormat(job.closed_date, false, true)}

                                </Alert>
                                <Stack gap={"0.5rem"}>
                                    <Typography sx={{fontWeight: 500}}>Closed by</Typography>
                                    <Stack alignItems={"center"} gap={"0.5rem"} direction={"row"}>
                                        <UserAvatar name={job.closed_by.name}/>
                                        <Typography component={"h5"}>{job.closed_by.name}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </>
                    }
                </>
            }
        </Box>
    )
}

export default LeadJobShort;