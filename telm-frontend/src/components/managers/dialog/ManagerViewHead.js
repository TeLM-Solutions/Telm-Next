import {Box, Stack, Typography} from "@mui/material";
import ShimmerBase from "@/components/shimmers/ShimmerBase";
import UserAvatar from "@/components/common/UserAvatar";

const ManagerViewHead = ({name, isLoading}) => {
    return (
        <Box sx={{m: 0, p: 2}} id="customized-dialog-title">
            {!isLoading &&
                <>
                    <Stack direction="row"
                           alignItems="center"
                           sx={{gap: '0.5rem'}}>
                        <UserAvatar name={name}/>
                        <Typography varient={"body2"}
                                    sx={{fontSize: '1rem'}}>{name}</Typography>
                    </Stack>
                </>
            }
            {isLoading &&
                <Stack gap={"0.5rem"} direction={"row"} alignItems="center">
                    <ShimmerBase circular={true} height={40} width={40}/>
                    <ShimmerBase height={16} width={140}/>
                </Stack>
            }
        </Box>
    )
}
export default ManagerViewHead;