import {Stack, Typography} from "@mui/material";
import React from "react";
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';

const LeadStatusTiny = ({lead_status, large = false}) => {
    const styles = {
        iconColor: lead_status === 0 ? '#4b8aff' : lead_status === 1 ? '#ff9300' : 'red',
        textColor: lead_status === 0 ? '#4b8aff' : lead_status === 1 ? '#ff9300' : 'red',
    };

    return (
        <Stack direction="row" gap="0.15rem" alignItems="center">
            <DeviceThermostatOutlinedIcon fontSize={large ? "small" : "tiny"} sx={{color: styles.iconColor}}/>
            <Typography sx={{
                fontSize: large ? '1rem' : '0.75rem',
                fontWeight: 500,
                color: styles.textColor,
            }}>
                {lead_status === 0 ? 'Cold' : lead_status === 1 ? 'Warm' : 'Hot'}
            </Typography>
        </Stack>
    );
}

export default LeadStatusTiny;