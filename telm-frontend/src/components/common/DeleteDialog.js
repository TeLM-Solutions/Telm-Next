import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {Button, CircularProgress, Stack, Typography} from "@mui/material";
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));
const DeleteDialog = ({isDialogOpen, handleDialogClose, handleDelete, title, message, isDeleting}) => {
    return (
        <BootstrapDialog
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent dividers>
                <Stack gap={"1rem"} alignItems={"center"}>
                    <Typography sx={{fontSize: '1.2rem'}}>
                        {message}
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"} gap={"0.3rem"}>
                        <ReportGmailerrorredOutlinedIcon color={"error"}/>
                        <Typography sx={{fontSize: '0.857rem', color: 'red'}}>
                            You can&apos;t undo this action.
                        </Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                {!isDeleting &&
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Confirm & Delete
                    </Button>
                }
                {isDeleting &&
                    <Button color="error" disabled={true} variant="contained" onClick={handleDelete}>
                        <CircularProgress size={"1.5rem"} color={"error"}/>
                    </Button>
                }
                <Button onClick={handleDialogClose} disabled={isDeleting} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}
export default DeleteDialog;