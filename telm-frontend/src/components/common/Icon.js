import React from 'react';

function Icon({ src, alt, width, height, color, ...rest }) {
    return (
        <img
            src={src.src}
            alt={alt}
            width={width}
            height={height}
            className={color}
            {...rest}
        />
    );
}

export default Icon;