import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {Alert, CircularProgress} from "@mui/material";

const LeadJobCloseConfirmDialog = ({open, handleClose, isStatusUpdating, handleConfirm}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Close Job"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{fontWeight: 500}}>
                    Are you sure want to close this job?
                </DialogContentText>
                <Alert severity={"warning"} sx={{marginTop: '1rem'}}>Closing this job will mark the lead as
                    <strong> completed</strong>.</Alert>
            </DialogContent>
            <DialogActions>

                <Button variant={"contained"} onClick={handleConfirm} disabled={isStatusUpdating}>
                    {isStatusUpdating &&
                        <CircularProgress size={"1.5rem"}/>
                    }
                    {!isStatusUpdating &&
                        'Confirm & Close the Job'
                    }
                </Button>

                <Button onClick={handleClose} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default LeadJobCloseConfirmDialog;