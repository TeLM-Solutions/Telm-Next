import {Stack, Typography} from "@mui/material";
import {Group, PermPhoneMsg} from "@mui/icons-material";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import React from "react";

const FollowupContactType = ({type, isSmall = false}) => {
    return (
        <>
            {type === 'call' &&
                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                    <PermPhoneMsg fontSize={isSmall ? "0.875rem" : "medium"}/>
                    <Typography sx={{
                        fontSize: isSmall ? "0.875rem" : "1rem"
                    }}>Call</Typography>
                </Stack>
            }
            {type === 'online' &&
                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                    <VideoCameraFrontIcon fontSize={isSmall ? "0.875rem" : "medium"}/>
                    <Typography sx={{
                        fontSize: isSmall ? "0.875rem" : "1rem"
                    }}>Online Meeting</Typography>
                </Stack>
            }
            {type === 'in-person' &&
                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                    <Group fontSize={isSmall ? "0.875rem" : "medium"}/>
                    <Typography sx={{
                        fontSize: isSmall ? "0.875rem" : "1rem"
                    }}>In-Person</Typography>
                </Stack>
            }
        </>
    )
}
export default FollowupContactType