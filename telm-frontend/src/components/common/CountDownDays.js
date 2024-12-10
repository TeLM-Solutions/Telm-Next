import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {Box, Chip, Stack} from "@mui/material";
import {dateFormat} from "@/lib/relativeTime";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

moment.tz.setDefault('Asia/Dubai');


const horizontalStyle = {
    top: '-12px',
    paddingTop: '1rem',
    borderBottomLeftRadius: '1rem',
    borderBottomRightRadius: '1rem',
    paddingBottom: '0.4rem',
    textAlign: 'center',
}
const verticalStyle = {
    padding: '0 1rem 0 1.5rem',
    borderTopRightRadius: '1rem',
    borderBottomRightRadius: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: '-1rem',
    border: '1px solid #ddd',
    lineHeight: 1,
    textWrap: 'nowrap'

}
const CountdownDays = ({targetDate, targetTime, jobStatus, followUpStatus, vertical = false}) => {
    const [countdownText, setCountdownText] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#fff'); // Default background color
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    useEffect(() => {
        const now = moment().startOf('day');
        const target = moment(targetDate);

        // Calculate the difference in days
        const daysDifference = target.diff(now, 'days');

        if (daysDifference === 0) {
            setCountdownText('Today');
            setBackgroundColor('linear-gradient(4deg, #ff8787, transparent)'); // Light red for today
        } else if (daysDifference < 0) {
            setCountdownText('Overdue');
            setBackgroundColor('linear-gradient(4deg, #e03d3d, transparent)'); // Red for overdue
        } else if (daysDifference === 1) {
            setCountdownText('Tomorrow');
            setBackgroundColor('linear-gradient(4deg, #e0b23d, transparent)'); // Light yellow for reaching 2 days
        } else if (daysDifference <= 2) {
            setCountdownText(`${daysDifference} days left`);
            setBackgroundColor('linear-gradient(4deg, #e0b23d, transparent)'); // Light yellow for reaching 2 days
        } else {
            setCountdownText(`${daysDifference} days left`);
            setBackgroundColor('linear-gradient(4deg, #3de07e, transparent)'); // Light green for other cases
        }

        if (jobStatus == 0) {
            setCountdownText('Job Closed');
            setBackgroundColor('linear-gradient(4deg, #86be9c, transparent)'); // Light green for other cases
        }
        if (jobStatus == 1 && followUpStatus != 1) {
            setCountdownText('Closed');
            setBackgroundColor('linear-gradient(4deg, #3de07e, transparent)'); // Light green for other cases
        }
    }, [targetDate]);
    const selectedStyle = vertical ? verticalStyle : horizontalStyle; // Conditionally select the style

    return (
        <Stack direction={vertical ? "row" : "column"} sx={{width: vertical ? 'fit-content' : 130}}>
            <Chip
                sx={{
                    background: '#fff',
                    position: 'relative',
                    zIndex: 2,
                    minHeight: '32px',
                    maxHeight: 'fit-content',
                    height: 'fit-content',
                    fontWeight: 600,
                }}
                variant={"outlined"}
                label={
                    <Stack direction={vertical ? "row" : "column"} gap={vertical ? "0.5rem" : 0}>
                        {dateFormat(targetDate, false, true)}
                        {targetTime &&
                            <Box>
                                {targetTime}
                            </Box>
                        }
                    </Stack>

                }/>
            <Box sx={{
                background: backgroundColor,
                position: 'relative',
                zIndex: 1,
                fontSize: 12,
                fontWeight: 600,
                ...selectedStyle
            }}>
                {countdownText}

            </Box>
        </Stack>
    );
};

export default CountdownDays;