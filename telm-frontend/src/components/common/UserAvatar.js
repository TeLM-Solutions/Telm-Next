import React from 'react';
import Avatar from '@mui/material/Avatar';
import hashColor from "@/components/common/hashColor";

const UserAvatar = (props) => {
    const avatarSize = props.large ? '4rem' : props.small ? '24px' : '2.2rem'; // Define the size based on the 'large' prop

    let initials;

    if (props.name.includes(' ')) {
        // If the name has a space, return the first two letters of each part
        const parts = props.name.split(' ');
        initials = `${parts[0][0]}${parts[1][0]}`;
    } else {
        // If the name doesn't have a space, return the first letter only
        initials = props.name[0];
    }

    return (
        <Avatar
            variant={props.variant}
            sx={{
                bgcolor: `hsl(${hashColor(props.name) % 360}, 70%, 40%)`,
                fontSize: props.large ? '1.5rem' : props.small ? '0.75rem' : '1rem',
                width: avatarSize, // Set width based on 'avatarSize'
                height: avatarSize,
                textTransform: 'uppercase'// Set height based on 'avatarSize'
            }}
        >
            {initials}
        </Avatar>
    );
};


export default UserAvatar;