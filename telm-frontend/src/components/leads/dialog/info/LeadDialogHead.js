import {Box, Chip, Collapse, Paper, Stack, Typography} from "@mui/material";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import {Call} from "@mui/icons-material";
import LeadUrgency from "@/components/leads/shared/LeadUrgency";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";
import Link from "next/link";
import {useAuth} from "@/hooks/auth";
import LeadStageChanger from "@/components/leads/dialog/info/LeadStageChanger";

const LeadDialogHead = ({business, urgency, lead_status, hasScrolled = false, lead_stage, leadId}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {user} = useAuth({middleware: 'auth'})

    return (
        <Stack direction={isMobile ? "column" : "row"} padding={2} gap={isMobile ? "1rem" : "2rem"}>
            <Box className={`${isMobile ? 'mobile-business' : ''} ${hasScrolled ? 'business-small' : ''}`}>
                <BusinessNameBlock
                    large={true}
                    name={business.name}
                    location={business.location.name}
                    showLeadStatus={!isMobile}
                    leadStatus={lead_status}
                />
            </Box>
            <Collapse in={!hasScrolled} unmountOnExit>
                <Stack direction={"row"} gap={isMobile ? "1rem" : "2rem"} sx={{position: 'relative'}}>
                    <Stack direction={"column"} gap={"0.5rem"} alignItems={"start"}>
                        <Typography sx={{fontSize: '0.75rem'}}>
                            Landphone Number
                        </Typography>

                        {isMobile &&
                            <Link
                                href={`tel:${business.landphone}`}>
                                <Chip color="primary" sx={{fontSize: '1rem', paddingLeft: '0.5rem'}}
                                      icon={<Call fontSize={"small"}/>}
                                      variant={"outlined"}
                                      label={business.landphone}/>
                            </Link>
                        }
                        {!isMobile &&
                            <Chip color="primary" sx={{fontSize: '1rem', paddingLeft: '0.5rem'}}
                                  icon={<Call fontSize={"small"}/>}
                                  variant={"outlined"}
                                  label={business.landphone}/>
                        }


                    </Stack>
                    <Stack direction={"column"} gap={"0.5rem"} alignItems={"start"}>
                        <Typography sx={{fontSize: '0.75rem'}}>
                            Urgency
                        </Typography>
                        <LeadUrgency urgency={urgency}/>
                    </Stack>

                    {isMobile &&
                        <Box sx={{position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)'}}>
                            <LeadStatusTiny lead_status={lead_status}/>
                        </Box>
                    }
                    {!isMobile &&
                        <LeadStageChanger stage={lead_stage} leadId={leadId}/>
                    }
                    {isMobile &&
                        <Paper
                            sx={{
                                position: 'fixed',
                                bottom: 0,
                                background: '#fff',
                                left: 0,
                                right: 0,
                                padding: '0.5rem 1rem',
                                zIndex: 99,
                                boxShadow: '0 0 10px #ddd',
                                maxWidth: '100% !important'
                            }}>
                            <LeadStageChanger stage={lead_stage} leadId={leadId}/>
                        </Paper>
                    }

                </Stack>
            </Collapse>


        </Stack>
    )
}
export default LeadDialogHead;