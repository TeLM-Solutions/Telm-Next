import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import React, {useEffect, useRef, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {fetchALead, resetLeadState} from "@/store/slices/leadSlice";
import {dispatch, useSelector} from "@/store";
import BusinessNameShimmer from "@/components/shimmers/BusinessNameShimmer";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Divider, Stack} from "@mui/material";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LeadServices from "@/components/leads/dialog/info/LeadServices";
import LeadServicesShimmer from "@/components/shimmers/LeadServicesShimmer";
import {
    BallotOutlined,
    BusinessOutlined,
    LinearScaleOutlined,
    PersonAddAlt1Outlined,
    Report
} from "@mui/icons-material";
import LeadBusinessShort from "@/components/leads/dialog/info/LeadBusinessShort";
import LeadJobShort from "@/components/leads/dialog/info/LeadJobShort";
import LeadBusinessShortShimmer from "@/components/shimmers/LeadBusinessShortShimmer";
import LeadJobShortShimmer from "@/components/shimmers/LeadJobShortShimmer";
import LeadCreatedShort from "@/components/leads/dialog/info/LeadCreatedShort";
import LeadCreatedShortShimmer from "@/components/shimmers/LEadCreatedShortShimmer";
import LeadDialogHead from "@/components/leads/dialog/info/LeadDialogHead";
import BusinessCard from "@/components/leads/dialog/business/BusinessCard";
import FollowUpViewList from "@/components/followups/dialog/FollowUpViewList";
import {useAuth} from "@/hooks/auth";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollBehavior from "@/hooks/scroll";
import Typography from "@mui/material/Typography";
import {publish, subscribe, unsubscribe} from "@/lib/events";
import JobCreateForm from "@/components/jobs/shared/JobCreateForm";
import LeadStageHistory from "@/components/leads/shared/LeadStageHistory";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root:not(.MuiCard-root)': {
        maxWidth: 'fit-content',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
        },
    },
}));


const LeadViewDialog = ({id, isDialogOpen, handleDialogClose, activeTab = 0}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(true)
    const {lead} = useSelector((state) => state.leads);

    const {user} = useAuth({middleware: 'auth'})


    const [tab, setTab] = useState(activeTab);

    const handleTabChange = (event, newTab) => {
        console.log(event)
        setTab(newTab);
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchLead();
        }
    }, [isDialogOpen])

    const handleClose = () => {
        dispatch(resetLeadState())
        handleDialogClose();
        setIsLoading(true)
        setTab(0)
    }

    const fetchLead = async () => {
        await dispatch(fetchALead(id));
        setIsLoading(false)

    }

    const handleLeadServiceUpdate = async () => {
        await dispatch(fetchALead(id));
    }

    const onCreateJob = async () => {
        await dispatch(fetchALead(id));
        publish('job_created_from_lead_view');
    }


    useEffect(() => {
        const eventListener = async () => {
            await dispatch(fetchALead(id));
        };

        subscribe("followup_status_updated", eventListener);

        return () => {
            unsubscribe("followup_status_updated", eventListener);
        };
    }, [id]);
    // change hold to open
    // const handleStatusChange = async () => {
    //     await dispatch(changeStatus({leadId: id, type: 'open'}));
    //     await dispatch(fetchALead(id));
    // }

    // mobile scroll
    const scrollingElementRef = useRef(null);

    const hasScrolled = useScrollBehavior(scrollingElementRef, isMobile, isLoading);


    return (
        <BootstrapDialog
            onClose={handleClose}
            fullScreen={isMobile}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            scroll={isMobile ? "paper" : "body"}
        >
            <DialogTitle sx={{m: 0, p: 0}} id="customized-dialog-title">
                {lead !== null && !isLoading &&

                    <LeadDialogHead business={lead.business} lead_status={lead.lead_status} urgency={lead.urgency}
                                    hasScrolled={hasScrolled} lead_stage={lead.stage} leadId={lead.id}/>

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
                        <Tab icon={<TextSnippetOutlinedIcon/>} iconPosition="start" label="Info" tabIndex={0}/>
                        <Tab icon={<BusinessOutlined/>} iconPosition="start" label="Business Info" tabIndex={1}/>
                        {user.role !== 'executive' && lead?.job !== null &&
                            <Tab icon={<BallotOutlined/>} iconPosition="start" label="Job" tabIndex={2}/>
                        }
                        {user.role === 'manager' && lead?.job === null && lead?.status != 3 &&
                            <Tab icon={<PersonAddAlt1Outlined/>} iconPosition="start" label="Assign Job" tabIndex={2}/>
                        }
                        {user.role !== 'executive' &&
                            <Tab icon={<LinearScaleOutlined/>} iconPosition="start" label="Stage Logs"
                                 tabIndex={3}/>
                        }


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
            <DialogContent dividers
                           ref={scrollingElementRef}
                           sx={{padding: 0, width: isMobile ? '100%' : '60vw', height: '100%'}}
                           className={"has-gradient-bg"}>

                {lead?.status == 3 && tab === 0 &&
                    <Stack flexDirection={"row"} sx={{
                        background: "#ffde91",
                        borderBottom: "1px solid #ffb300",
                        borderTop: "1px solid #ffb300",
                        padding: '0.25rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}>
                        <Stack direction={"row"} gap={"0.5rem"}>
                            <Report fontSize={"small"}/>
                            <Typography>This lead is on hold.</Typography>
                        </Stack>
                        {/*<Button*/}
                        {/*    onClick={() => handleStatusChange()}*/}
                        {/*    sx={{background: "#fff", color: 'black', borderColor: 'black'}} variant="outlined"*/}
                        {/*    size={"small"}>Click here to open the*/}
                        {/*    lead</Button>*/}
                    </Stack>
                }


                <Stack p={{xs: "1rem 0.5rem 3rem", md: "1.5rem"}} gap={"1.5rem"} direction={"column"}>
                    {lead !== null && !isLoading &&
                        <>
                            {tab === 0 &&
                                <>
                                    <LeadServices services={lead.services} onUpdateService={handleLeadServiceUpdate}/>
                                    {user.role !== 'executive' &&
                                        <LeadJobShort services={lead.services} job={lead.job}
                                                      onClickMore={() => setTab(2)}
                                                      canAssign={lead.status == 1 && user.role == 'manager'}/>
                                    }
                                    <LeadBusinessShort business={lead.business} onClickMore={() => setTab(1)}/>
                                    <LeadCreatedShort created_at={lead.created_at} user={lead.user}
                                                      note={lead.note} status={lead.status}
                                                      classification={lead.lead_status} lead_source={lead.source}/>
                                </>
                            }
                            {tab === 1 &&
                                <>
                                    <BusinessCard business={lead.business}/>
                                </>
                            }
                            {tab === 2 &&
                                <>
                                    {lead?.job !== null &&
                                        <>
                                            <LeadJobShort services={lead.services} showMore={false} job={lead.job}/>
                                            <FollowUpViewList
                                                followups={lead.job.followups}
                                                emit={true}
                                                job_id={lead.job.id}
                                                canCreate={lead.job.user.id == user.id && lead.job.status == 1}

                                            />
                                        </>
                                    }

                                    {user.role === 'manager' && lead?.job === null &&
                                        <Box sx={{
                                            background: '#fff', padding: {
                                                xs: "0",
                                                md: "1rem"
                                            }
                                        }}>
                                            <JobCreateForm onSuccess={onCreateJob} isDialogOpen={tab === 2}
                                                           initialFilterState={{}} directEmbedData={{
                                                lead_id: lead.id,
                                                lead: lead
                                            }}
                                                           onCancel={() => console.log('cancelled')}/>
                                        </Box>

                                    }
                                </>
                            }
                            {tab === 3 &&
                                <>

                                    <LeadStageHistory tab={tab === 3} leadId={lead.id}/>

                                </>
                            }
                        </>
                    }
                    {isLoading &&
                        <>
                            <LeadServicesShimmer/>
                            <LeadBusinessShortShimmer/>
                            {user.role !== 'executive' &&
                                <>
                                    <LeadJobShortShimmer/>
                                    <LeadCreatedShortShimmer/>
                                </>
                            }
                        </>
                    }
                </Stack>

            </DialogContent>
        </BootstrapDialog>
    )
}

export default LeadViewDialog;