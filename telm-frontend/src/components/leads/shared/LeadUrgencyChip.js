import {Chip, Stack, Typography} from "@mui/material";

const LeadUrgencyChip = ({urgency}) => {
    const leadUrgency = <Stack direction={"row"} alignItems={"center"}
                               gap={"0.5rem"}>
        <Typography
            sx={{fontSize: '12px'}}>Urgency</Typography>
        <Chip
            sx={{height: 24}}
            color={urgency == 1 ? 'warning' : 'default'}
            label={urgency == 1 ? 'High' : 'Low'}/>
    </Stack>
    return (
        <Chip
            variant={"outlined"}
            sx={{
                width: 'fit-content',
                '& > .MuiChip-label': {
                    paddingRight: '4px'
                }
            }} label={leadUrgency}/>
    );
}

export default LeadUrgencyChip;