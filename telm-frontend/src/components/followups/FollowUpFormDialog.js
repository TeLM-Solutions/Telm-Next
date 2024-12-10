import {styled, useTheme} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import FollowupCreateForm from "@/components/followups/shared/FollowupCreateForm";
import {publish} from "@/lib/events";


const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    }, '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));


const FollowUpFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, onSuccess, initialFilterState}) => {

    // mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        handleDialogClose();
    }
    const handleSuccess = () => {
        if (initialData) {
            publish('followup_edit_completed');
        }
        onSuccess();
    }


    return (<BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isDialogOpen}
        fullScreen={isMobile}
        scroll={isMobile ? "paper" : "body"}

    >
        <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
            {initialData ? 'Update Follow Up' : 'New Follow Up'}
        </DialogTitle>
        <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
                position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
            }}
        >
            <CloseIcon/>
        </IconButton>
        <DialogContent dividers sx={{padding: 0, position: 'relative'}}>

            <FollowupCreateForm initialData={initialData} initialFilterState={initialFilterState}
                                handleDialogClose={handleDialogClose} isDialogOpen={isDialogOpen}
                                onSuccess={handleSuccess}/>

        </DialogContent>

    </BootstrapDialog>)
}
export default FollowUpFormDialog;