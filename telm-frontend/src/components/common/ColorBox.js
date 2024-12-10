import React from 'react';
import Box from '@mui/material/Box';
import hashColor from "@/components/common/hashColor";

function ColoredBox({text, tiny = false, large = false}) {
    const bgColor = `hsl(${hashColor(text) % 360}, 70%, 50%)`;
    const size = large ? '0.75rem' : (tiny ? '0.25rem' : '0.5rem'); // Conditionally set the size

    const boxStyle = {
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: bgColor,
        flex: 'none'
    };

    return <Box sx={boxStyle}/>;
}

export default ColoredBox;