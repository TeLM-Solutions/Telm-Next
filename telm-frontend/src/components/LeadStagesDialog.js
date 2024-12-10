import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {Button, CircularProgress, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import {fetchLeadStages} from "@/store/slices/leadStagesSlice";
import ColorBox from "@/components/common/ColorBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },

}));
const LeadStagesDialog = ({isDialogOpen, handleDialogClose, handleChange, currentStage, isLoading}) => {
    const dispatch = useDispatch();

    const {loading, lead_stages} = useSelector((state) => state.leadStages);
    const [selectedStage, setSelectedStage] = useState(currentStage.id)

    useEffect(() => {
        if (isDialogOpen) {
            dispatch(fetchLeadStages());
        }
    }, [dispatch, isDialogOpen]);

    return (
        <BootstrapDialog
            sx={{
                '& .MuiPaper-root': {
                    maxWidth: {
                        xs: '100vw',
                        md: 480
                    },
                    margin: {
                        xs: '1rem',
                        md: 'auto'
                    },
                    width: {
                        xs: '100vw',
                        md: 480
                    }
                },
            }}
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                Lead Stages
            </DialogTitle>
            <DialogContent dividers sx={{
                padding: 0,
            }}>

                {loading &&
                    <Stack sx={{padding: '1rem', minHeight: 300, alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress size={"1rem"}/>
                    </Stack>
                }

                <Stack direction={"column"}
                       sx={{
                           background: '#fff',
                           '& > div': {
                               display: 'flex',
                               padding: '0.5rem 1rem',
                               justifyContent: 'space-between',
                               alignItems: 'center',
                               alignSelf: 'stretch',
                               cursor: 'pointer',
                               borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                               '&:last-child': {
                                   borderBottom: 'none'
                               },
                               '&.active': {
                                   background: 'linear-gradient(156deg, #C9F2FF 0%, #FFF 100%)'
                               }
                           }
                       }}
                >
                    <>
                        {!loading && lead_stages.length > 0 && lead_stages.map((stage) => (
                            <Stack
                                key={stage.id}
                                onClick={() => {
                                    setSelectedStage(stage.id)
                                }}
                                alignItems="center"
                                direction="row"
                                className={selectedStage == stage.id ? 'active' : ''}
                            >
                                <Stack alignItems="center" gap="0.5rem"
                                       direction="row">
                                    <ColorBox text={stage.title}/>
                                    <Typography
                                        component="h5">{stage.title}</Typography>
                                </Stack>

                                <div>
                                    {selectedStage == stage.id ? (
                                        <CheckCircleIcon color="secondary"/>
                                    ) : (
                                        <RadioButtonUncheckedIcon
                                            sx={{fill: '#AFAFAF'}}/>
                                    )}
                                </div>
                            </Stack>
                        ))}
                    </>


                </Stack>


            </DialogContent>
            <DialogActions>
                {!isLoading &&
                    <Button variant="contained" onClick={() => handleChange(selectedStage)}>
                        Change Stage
                    </Button>
                }
                {isLoading &&
                    <Button disabled={true} variant="contained">
                        <CircularProgress size={"1.5rem"}/>
                    </Button>
                }
                <Button onClick={handleDialogClose} disabled={isLoading} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}
export default LeadStagesDialog;