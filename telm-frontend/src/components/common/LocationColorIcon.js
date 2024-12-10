import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

function LocationColorIcon({text}) {
    // Generate a background color from the text
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    const bgColor = `hsl(${hashCode(text) % 360}, 70%, 50%)`;

    const boxStyle = {
        color: bgColor,
        fontSize: 16
    };

    return <FmdGoodIcon sx={boxStyle}/>;
}

export default LocationColorIcon;