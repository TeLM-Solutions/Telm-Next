import {styled, useTheme} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import JobCreateForm from "@/components/jobs/shared/JobCreateForm";
import useMediaQuery from "@mui/material/useMediaQuery";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    }, '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));

const JobFormDialog = ({isDialogOpen, handleDialogClose, initialData = null, initialFilterState, onSuccess}) => {

    const handleClose = () => {
        handleDialogClose();
    }
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (<BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isDialogOpen}
        fullScreen={isMobile}
        scroll={isMobile ? "paper" : "body"}
    >
        <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
            {initialData ? 'Update Job' : 'New Job'}
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

            <JobCreateForm initialFilterState={initialFilterState} isDialogOpen={isDialogOpen}
                           initialData={initialData} onSuccess={onSuccess} onCancel={handleClose}/>

        </DialogContent>

    </BootstrapDialog>)
}
export default JobFormDialog;