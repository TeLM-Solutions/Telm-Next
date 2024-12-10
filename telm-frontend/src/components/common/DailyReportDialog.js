import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Button, CircularProgress, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import React, {useState} from "react";
import DialogContent from "@mui/material/DialogContent";
import moment from "moment-timezone";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {useDispatch} from "@/store";
import {generateDailyReport} from "@/store/slices/leadSlice";

moment.tz.setDefault('Asia/Dubai');

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        maxWidth: 'fit-content'
    },
}));
const DailyReportDialog = ({isDialogOpen, handleDialogClose}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState(moment())
    const [endDate, setEndDate] = useState(null)
    const dispatch = useDispatch();

    const handleGenerate = async () => {
        setIsLoading(true)
        await dispatch(generateDailyReport({
            start_date: moment(startDate).format('YYYY-MM-DD'),
            end_date: endDate ? moment(endDate).format('YYYY-MM-DD') : 'all'
        }))
        handleDialogClose()
    }
    return (
        <BootstrapDialog
            onClose={handleDialogClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
        >
            <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
                Generate Daily Report
            </DialogTitle>
            <DialogContent dividers>
                <Stack direction={"column"} gap={"1rem"}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(date) => {
                                setStartDate(date)
                            }}

                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => {
                                setEndDate(date)
                            }}
                            shouldDisableDate={(date) =>
                                startDate ? date.isBefore(startDate, 'day') : false
                            }

                        />
                    </LocalizationProvider>
                </Stack>
            </DialogContent>
            <DialogActions>
                {!isLoading &&
                    <Button variant="contained" onClick={handleGenerate}>
                        Generate
                    </Button>
                }
                {isLoading &&
                    <Button color="error" disabled={true} variant="contained">
                        <CircularProgress size={"1.5rem"} color={"error"}/>
                    </Button>
                }
                <Button onClick={handleDialogClose} disabled={isLoading} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}
export default DailyReportDialog;