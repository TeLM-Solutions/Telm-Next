import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import React, {useEffect, useRef, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import {dispatch, useSelector} from "@/store";
import BusinessNameShimmer from "@/components/shimmers/BusinessNameShimmer";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Divider, Stack} from "@mui/material";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import LeadServices from "@/components/leads/dialog/info/LeadServices";
import {BallotOutlined, BusinessOutlined, Report} from "@mui/icons-material";
import LeadBusinessShort from "@/components/leads/dialog/info/LeadBusinessShort";
import LeadJobShort from "@/components/leads/dialog/info/LeadJobShort";
import LeadBusinessShortShimmer from "@/components/shimmers/LeadBusinessShortShimmer";
import LeadCreatedShort from "@/components/leads/dialog/info/LeadCreatedShort";
import LeadDialogHead from "@/components/leads/dialog/info/LeadDialogHead";
import BusinessCard from "@/components/leads/dialog/business/BusinessCard";
import {useAuth} from "@/hooks/auth";
import {fetchAFollowUp, resetFollowUpState} from "@/store/slices/followupSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollBehavior from "@/hooks/scroll";
import {subscribe, unsubscribe} from "@/lib/events";
import FollowUpViewList from "@/components/followups/dialog/FollowUpViewList";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root:not(.MuiCard-root)': {
        maxWidth: 'fit-content'
    },
}));


const FollowUpViewDialog = ({id, isDialogOpen, handleDialogClose, onClickEdit}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {user} = useAuth({middleware: 'auth'})

    const [isLoading, setIsLoading] = useState(true)
    const {followup} = useSelector((state) => state.followups);

    const [tab, setTab] = useState(0);

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchFollowup();
        }
    }, [isDialogOpen])

    const handleClose = () => {
        dispatch(resetFollowUpState())
        handleDialogClose();
        setIsLoading(true)
        setTab(0)
    }

    const fetchFollowup = async () => {
        if (isDialogOpen) {
            await dispatch(fetchAFollowUp(id));
            setIsLoading(false)
        }
    }

    const handleOnClickEdit = (followupID) => {
        onClickEdit(id, followupID)
    }

    const scrollingElementRef = useRef(null);
    const hasScrolled = useScrollBehavior(scrollingElementRef, isMobile, isLoading);

    useEffect(() => {
        subscribe("followup_edit_completed", fetchFollowup);

        return () => {
            unsubscribe("followup_edit_completed", fetchFollowup);
        };
    }, []);

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            fullScreen={isMobile}
            scroll={isMobile ? "paper" : "body"}
        >
            <DialogTitle sx={{m: 0, p: 0}} id="customized-dialog-title">
                {followup !== null && !isLoading &&

                    <LeadDialogHead business={followup.lead.business} lead_status={followup.lead.lead_status}
                                    urgency={followup.lead.urgency} hasScrolled={hasScrolled}
                                    lead_stage={followup.lead.stage} leadId={followup.lead.id}/>

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
                        <Tab icon={<TextSnippetOutlinedIcon/>} iconPosition="start" label="Follow Ups"/>
                        <Tab icon={<BallotOutlined/>} iconPosition="start" label="Info"/>
                        <Tab icon={<BusinessOutlined/>} iconPosition="start" label="Business Info"/>
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
            <DialogContent ref={scrollingElementRef} dividers sx={{padding: 0, width: isMobile ? '100vw' : '60vw'}}
                           className={"has-gradient-bg"}>


                <Stack p={{xs: "1rem 0.5rem 3rem", md: "1.5rem"}} gap={"1.5rem"} direction={"column"}>
                    {followup !== null && !isLoading &&
                        <>
                            {tab === 1 &&
                                <>
                                    <LeadServices services={followup.lead.services} onUpdateService={fetchFollowup}/>
                                    <LeadBusinessShort business={followup.lead.business} onClickMore={() => setTab(2)}/>
                                    <LeadJobShort showMore={false} job={followup} onClickMore={() => setTab(1)}
                                                  services={followup.lead.services}/>
                                    <LeadCreatedShort created_at={followup.lead.created_at}
                                                      user={followup.lead.user} note={followup.lead.note}
                                                      status={followup.lead.status}
                                                      classification={followup.lead.lead_status}
                                                      lead_source={followup.lead.source}/>
                                </>
                            }
                            {tab === 2 &&
                                <>
                                    <BusinessCard business={followup.lead.business}/>
                                </>
                            }
                            {tab === 0 &&
                                <Stack sx={{position: 'relative'}}>
                                    {followup.status != 1 &&
                                        <Stack flexDirection={"row"} sx={{
                                            background: "#ffde91",
                                            borderBottom: "1px solid #ffb300",
                                            borderTop: "1px solid #ffb300",
                                            padding: '0.25rem',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '1rem',
                                            position: 'absolute',
                                            top: '-1.5rem',
                                            right: '-1.5rem',
                                            left: '-1.5rem'
                                        }}>
                                            <Stack direction={"row"} gap={"0.5rem"}>
                                                <Report fontSize={"small"}/>
                                                <Typography>Job is closed.</Typography>
                                            </Stack>
                                        </Stack>
                                    }
                                    <FollowUpViewList followups={followup.followups}
                                                      emit={true}
                                                      job_id={followup.id}
                                                      job_status={followup.status}
                                                      onClickEdit={handleOnClickEdit}
                                                      showTitle={false}
                                                      canCreate={followup.user.id == user.id && followup.status == 1}/>
                                </Stack>
                            }
                        </>
                    }
                    {isLoading &&
                        <>
                            <LeadBusinessShortShimmer title={""}/>
                        </>
                    }
                </Stack>

            </DialogContent>
        </BootstrapDialog>
    )
}

export default FollowUpViewDialog;