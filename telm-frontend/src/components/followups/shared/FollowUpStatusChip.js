import React from 'react';
import {Chip} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UpdateIcon from '@mui/icons-material/Update';

export const getStatusStyles = (status) => {
    switch (status) {
        case 1:
            return {
                label: 'Open',
                backgroundColor: '#453E98',
                icon: <RadioButtonUncheckedIcon color={"#fff"}/>,
            };
        case 0:
            return {
                label: 'Not Interested',
                backgroundColor: '#D72323',
                icon: <DoDisturbIcon color={"#fff"}/>,
            };
        case 2:
            return {
                label: 'Completed',
                backgroundColor: '#2B9242',
                icon: <CheckCircleOutlineIcon color={"#fff"}/>,
            };
        case 3:
            return {
                label: 'Rescheduled',
                backgroundColor: '#EF6C00',
                icon: <UpdateIcon color={"#fff"}/>,
            };
        default:
            return {
                label: 'Unknown',
                backgroundColor: '#000',
                icon: null,
            };
    }
};

const FollowUpStatusChip = ({status, isSmall = false}) => {
    const {label, backgroundColor, textColor, icon} = getStatusStyles(status);

    return (
        <Chip
            label={label}
            sx={{
                backgroundColor: backgroundColor,
                color: '#fff',
                fontSize: 14,
                width: 'fit-content'
            }}
            icon={icon}
        />
    );
};

export default FollowUpStatusChip;