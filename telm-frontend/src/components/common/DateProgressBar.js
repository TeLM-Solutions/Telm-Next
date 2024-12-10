import {Box} from "@mui/material";
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Dubai');

const DateProgressBar = ({startDate, endDate, status = null}) => {
    const now = moment(); // Use moment with the UAE timezone
    const start = moment(startDate); // Convert startDate to moment
    const end = moment(endDate); // Convert endDate to moment

    // Calculate the progress percentage
    const totalDuration = end.diff(start, "days"); // Use "days" for day difference
    const elapsedDuration = now.diff(start, "days"); // Use "days" for day difference
    let progress = (elapsedDuration / totalDuration) * 100;
    if (progress < 0) {
        progress = 0;
    }
    if (progress > 100) {
        progress = 100;
    }

    let color = "#868F97";
    const daysLeft = totalDuration - elapsedDuration;

    let progressText = `${daysLeft} days left`;

    if (progress >= 50 && progress < 80) {
        color = "#ed9112";
    } else if (progress >= 80) {
        color = "#ed1212";
    }

    const rightValue =
        progress === 0 ? "-80px" : progress > 90 ? "0" : progress < 30 ? "-60px" : "0";

    if (start.isAfter(now)) {
        // Start date is in the future, so it's Upcoming
        progressText = "Upcoming";
    } else if (end.isSame(now, "day")) {
        // End date is today
        progressText = "Today";
    } else if (end.isBefore(now)) {
        // End date is in the past, so it's Overdue
        progressText = "Overdue";
    }

    if (status !== null && status === 0) {
        progressText = 'Closed';
        color = 'green'
    }

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                backgroundColor: "#eee",
                borderRadius: "4px",
                height: "0.18rem",
            }}
        >
            <Box
                sx={{
                    width: `${progress}%`,
                    backgroundColor: color,
                    borderRadius: "4px",
                    textAlign: "right",
                    color: "white",
                    height: "0.18rem",
                    position: "relative",
                    "&:after": {
                        content: `"${progressText}"`,
                        position: "absolute",
                        top: "50%",
                        right: rightValue,
                        transform: "translateY(-50%)",
                        background: `${color}`,
                        borderRadius: "0.2rem",
                        padding: "0.04rem 0.5rem",
                        fontSize: "0.75rem",
                        minWidth: "5rem",
                        textAlign: "center",
                    },
                }}
            >
            </Box>
        </Box>
    );
};

export default DateProgressBar;