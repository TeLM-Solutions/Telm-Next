import React from 'react';
import {Box} from '@mui/material';

const Shimmer = ({height, width, circular = false}) => {
    const shimmerStyle = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        borderRadius: circular ? `${width}px` : '0.25rem',
        animation: 'shimmer 1.5s infinite',
    };

    return <Box className="shimmer" sx={shimmerStyle}></Box>;
};

export default Shimmer;