import {Box, Stack, Typography} from "@mui/material";
import ColorBox from "@/components/common/ColorBox";
import ShimmerBase from "@/components/shimmers/ShimmerBase";

const BranchDialogHead = ({name, address, isLoading}) => {
    return (
        <Box sx={{m: 0, p: 2}} id="customized-dialog-title">
            {!isLoading &&
                <>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <ColorBox text={name}/>
                        <Typography
                            component={"h2"}
                            sx={{color: '#000', fontSize: '1.125rem'}}
                        >
                            {name}
                        </Typography>
                    </Stack>
                    <Typography component={"p"}>{address}</Typography>
                </>
            }
            {isLoading &&
                <Stack gap={"1rem"}>
                    <ShimmerBase height={16} width={80}/>
                    <ShimmerBase height={16} width={120}/>
                </Stack>
            }
        </Box>
    )
}
export default BranchDialogHead;