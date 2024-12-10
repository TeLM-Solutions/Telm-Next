import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Stack, Typography} from "@mui/material";
import {CancelOutlined, FiberManualRecord} from "@mui/icons-material";
import {useState} from "react";
import LeadStagesDialog from "@/components/LeadStagesDialog";
import {useDispatch} from "@/store";
import {changeLeadStage} from "@/store/slices/leadSlice";
import {publish} from "@/lib/events";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Snack from "@/components/common/Snack";
import {useAuth} from "@/hooks/auth";
import ColorBox from "@/components/common/ColorBox";

const LeadStageChanger = ({stage, leadId, isSmall = false, showTitle = true}) => {
    const dispatch = useDispatch();
    const {user} = useAuth({middleware: 'auth'})

    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const [showSnack, setShowSnack] = useState(false)


    const handleClickChange = () => {
        setShowDialog(true);
    }

    const handleCloseDialog = () => {
        setShowDialog(false)
    }

    const handleChange = async (stage) => {
        setIsLoading(true);
        await dispatch(changeLeadStage({
            leadId,
            stage
        }))
        publish('job_created_from_lead_view');
        publish('followup_status_updated');
        publish('reload_jobs_table');
        publish('reload_followups_table');
        publish('reload_followups_table');
        publish('followup_edit_completed')

        setTimeout(() => {
            setIsLoading(false);
            setShowDialog(false)
            setShowSnack(true);
        }, 1800)
    }

    let buttonColor = "primary";
    let startIcon = <FiberManualRecord fontSize="small"/>;
    switch (stage.title) {
        case "Deal Closed": {
            buttonColor = "success";
            startIcon = <CheckCircleIcon/>
            break
        }
        case "Lead Lost": {
            buttonColor = "error";
            startIcon = <CancelOutlined/>
            break
        }
    }

    return (
        <>
            {user.role !== 'executive' &&
                <>
                    <Stack direction={"column"} gap={"0.5rem"} alignItems={"start"}>
                        {showTitle &&
                            <Typography sx={{fontSize: '0.75rem'}}>
                                Lead Stage
                            </Typography>
                        }
                        <Button color={buttonColor}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleClickChange()
                                }}
                                startIcon={!isSmall && startIcon}
                                variant={"outlined"}
                                sx={{
                                    zIndex: 3,
                                    position: 'relative',
                                    textWrap: 'nowrap'
                                }}
                                size={isSmall ? "small" : "normal"}
                                endIcon={<ArrowDropDownIcon/>}>

                            {stage.title}
                        </Button>
                    </Stack>

                    {showDialog &&

                        <LeadStagesDialog handleDialogClose={handleCloseDialog} isDialogOpen={showDialog}
                                          handleChange={handleChange} isUpdating={false} currentStage={stage}
                                          isLoading={isLoading}/>
                    }
                    <Snack showSnack={showSnack} snackMessage={"Lead stage is updated"}
                           onClose={() => setShowSnack(false)}/>
                </>
            }
            {user.role === 'executive' &&
                <>
                    <Stack direction={"column"} gap={"0.5rem"} alignItems={"start"}>
                        {showTitle &&
                            <Typography sx={{fontSize: '0.75rem'}}>
                                Lead Stage
                            </Typography>
                        }
                        <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                            <ColorBox text={stage.title}/>
                            <Typography sx={{fontSize: '1rem'}}>
                                {stage.title}
                            </Typography>
                        </Stack>
                    </Stack>
                </>
            }
        </>

    )
}

export default LeadStageChanger