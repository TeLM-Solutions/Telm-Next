import React from 'react';
import {Chip, Stack, Typography} from '@mui/material';
import {getStatusStyles} from "@/components/followups/shared/FollowUpStatusChip";


const FollowUpStatusChipSmall = ({status, isSmall = false, hideStatusText = false}) => {
    const {label, backgroundColor, textColor, icon} = getStatusStyles(status);

    const StatusChip = <Stack direction={"row"} alignItems={"center"}
                              gap={"0.5rem"}>
        {!hideStatusText &&
            <Typography
                sx={{fontSize: '12px'}}>Status</Typography>
        }
        <Chip
            sx={{height: 24, background: backgroundColor, color: '#fff'}}
            label={label}/>
    </Stack>

    return (
        <Chip
            variant={"outlined"}
            sx={{
                width: 'fit-content',
                borderColor: '#dfdfdf',
                '& > .MuiChip-label': {
                    paddingRight: '4px',
                    paddingLeft: hideStatusText ? '4px' : '12px'
                }
            }} label={StatusChip}/>
    )
};

export default FollowUpStatusChipSmall;