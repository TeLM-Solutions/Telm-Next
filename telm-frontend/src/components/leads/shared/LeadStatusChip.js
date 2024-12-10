import {Chip, Stack, Typography} from "@mui/material";

const LeadStatusChip = ({status, text = "Status"}) => {
    let chipLabel = '';
    let chipColor = 'info'; // Default color

    if (status == 1) {
        chipLabel = 'Open';
        chipColor = 'info';
    } else if (status == 0 || status == 2) {
        chipLabel = 'Closed';
        chipColor = 'success';
    } else if (status == 3) {
        chipLabel = 'on Hold';
        chipColor = 'warning';
    }

    const leadStatus = (
        <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
            <Typography sx={{fontSize: '12px'}}>{text}</Typography>
            <Chip
                variant={status == 1 ? 'outlined' : 'contained'}
                sx={{height: 24}}
                color={chipColor}
                label={chipLabel}
            />
        </Stack>
    );

    return (
        <Chip
            variant={"outlined"}
            sx={{
                width: 'fit-content',
                '& > .MuiChip-label': {
                    paddingRight: '4px'
                }
            }}
            label={leadStatus}
        />
    );
};

export default LeadStatusChip;