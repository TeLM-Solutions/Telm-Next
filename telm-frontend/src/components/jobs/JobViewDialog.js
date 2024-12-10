import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {useEffect, useRef, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {dispatch, useSelector} from "@/store";
import BusinessNameShimmer from "@/components/shimmers/BusinessNameShimmer";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Chip, Divider, Stack} from "@mui/material";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LeadServices from "@/components/leads/dialog/info/LeadServices";
import LeadServicesShimmer from "@/components/shimmers/LeadServicesShimmer";
import {BallotOutlined, BusinessOutlined, FilePresentOutlined} from "@mui/icons-material";
import LeadBusinessShort from "@/components/leads/dialog/info/LeadBusinessShort";
import LeadJobShort from "@/components/leads/dialog/info/LeadJobShort";
import LeadBusinessShortShimmer from "@/components/shimmers/LeadBusinessShortShimmer";
import LeadJobShortShimmer from "@/components/shimmers/LeadJobShortShimmer";
import LeadCreatedShort from "@/components/leads/dialog/info/LeadCreatedShort";
import LeadCreatedShortShimmer from "@/components/shimmers/LEadCreatedShortShimmer";
import LeadDialogHead from "@/components/leads/dialog/info/LeadDialogHead";
import BusinessCard from "@/components/leads/dialog/business/BusinessCard";
import {fetchAJob, resetJobState} from "@/store/slices/jobSlice";
import FollowUpViewList from "@/components/followups/dialog/FollowUpViewList";
import {useAuth} from "@/hooks/auth";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollBehavior from "@/hooks/scroll";
import {subscribe, unsubscribe} from "@/lib/events";
import JobDocuments from "@/components/jobs/JobDocuments";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root:not(.MuiCard-root)': {
        maxWidth: 'fit-content'
    },
}));


const JobViewDialog = ({id, isDialogOpen, handleDialogClose}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {user} = useAuth({middleware: 'auth'})

    const [isLoading, setIsLoading] = useState(true)
    const {job} = useSelector((state) => state.jobs);

    const [tab, setTab] = useState(0);

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchJob();
        }
    }, [isDialogOpen])

    const handleClose = () => {
        dispatch(resetJobState())
        handleDialogClose();
        setIsLoading(true)
        setTab(0)
    }

    const fetchJob = async () => {
        await dispatch(fetchAJob(id));
        setIsLoading(false)

    }

    const handleLeadServiceUpdate = async () => {
        await dispatch(fetchAJob(id));
    }

    const scrollingElementRef = useRef(null);
    const hasScrolled = useScrollBehavior(scrollingElementRef, isMobile, isLoading);

    useEffect(() => {
        const eventListener = async () => {
            if (isDialogOpen) {
                await dispatch(fetchAJob(id));
            }
        };

        subscribe("followup_status_updated", eventListener);

        return () => {
            unsubscribe("followup_status_updated", eventListener);
        };
    }, [id, isDialogOpen]);

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            fullScreen={isMobile}
            scroll={isMobile ? "paper" : "body"}
        >
            <DialogTitle sx={{m: 0, p: 0}} id="customized-dialog-title">
                {job !== null && !isLoading &&

                    <LeadDialogHead business={job.lead.business} lead_status={job.lead.lead_status}
                                    urgency={job.lead.urgency} hasScrolled={hasScrolled} lead_stage={job.lead.stage}
                                    leadId={job.lead.id}/>


                }
                {isLoading &&
                    <Box p={2}><BusinessNameShimmer/></Box>
                }
                <Divider/>

                <Box sx={{background: '#fff'}}>
                    <Tabs
                        value={tab}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="secondary"
                        indicatorColor="secondary"
                        onChange={handleTabChange}
                        sx={{
                            maxWidth: {xs: 600, sm: '100%'},
                            '& .MuiButtonBase-root': {
                                padding: {
                                    xs: '0.56rem 5rem',
                                    md: '0.56rem 0'
                                },
                                flex: {
                                    xs: 'auto',
                                    md: 1
                                },
                                minHeight: 'auto',
                                textWrap: 'nowrap'
                            }
                        }}
                        aria-label="icon position tabs example"
                    >
                        <Tab icon={<BallotOutlined/>} iconPosition="start" label="Info"/>
                        <Tab icon={<TextSnippetOutlinedIcon/>} iconPosition="start"
                             label={
                                 <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                                     Followups <Chip label={job?.followups.length || 0} size={"small"}
                                                     variant={"outlined"}
                                                     color={job?.followups.length > 0 ? 'info' : 'default'}/>
                                 </Stack>
                             }/>
                        <Tab icon={<BusinessOutlined/>} iconPosition="start" label="Business Info"/>
                        <Tab icon={<FilePresentOutlined/>} iconPosition="start" label="Documents"/>
                    </Tabs>
                </Box>
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
            <DialogContent dividers sx={{padding: 0, width: isMobile ? '100%' : '60vw', height: '100%'}}
                           className={"has-gradient-bg"} ref={scrollingElementRef}>


                <Stack p={{xs: "1rem 0.5rem 3rem", md: "1.5rem"}} gap={"1.5rem"} direction={"column"}>
                    {job !== null && !isLoading &&
                        <>
                            {tab === 0 &&
                                <>
                                    <LeadServices services={job.lead.services}
                                                  onUpdateService={handleLeadServiceUpdate}/>
                                    <LeadJobShort services={job.lead.services} job={job} onClickMore={() => setTab(1)}/>
                                    <LeadBusinessShort business={job.lead.business} onClickMore={() => setTab(2)}/>
                                    <LeadCreatedShort created_at={job.lead.created_at} user={job.lead.user}
                                                      note={job.lead.note} status={job.lead.status}
                                                      classification={job.lead.lead_status}
                                                      lead_source={job.lead.source}/>
                                </>
                            }
                            {tab === 2 &&
                                <>
                                    <BusinessCard business={job.lead.business}/>
                                </>
                            }
                            {tab === 1 &&
                                <>
                                    <FollowUpViewList followups={job.followups}
                                                      emit={true}
                                                      job_id={job.id}
                                                      canCreate={job.user.id == user.id && job.status == 1}/>
                                </>
                            }
                            {tab === 3 &&
                                <>
                                    <JobDocuments tab={tab} id={job.id}/>
                                </>
                            }
                        </>
                    }
                    {isLoading &&
                        <>
                            <LeadServicesShimmer/>
                            <LeadBusinessShortShimmer/>
                            <LeadJobShortShimmer/>
                            {user.role !== 'executive' &&
                                <LeadCreatedShortShimmer/>
                            }
                        </>
                    }
                </Stack>

            </DialogContent>
        </BootstrapDialog>
    )
}

export default JobViewDialog;