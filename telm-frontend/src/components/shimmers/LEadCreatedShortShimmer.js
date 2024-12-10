import {Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';

import Shimmer from "@/components/shimmers/ShimmerBase";

const LeadCreatedShortShimmer = () => {
    return (
        <Box sx={{
            ...StyledPaper,
            minHeight: '153px'
        }}>
            <Box className={"heading"}>
                <Typography>Other Info</Typography>
            </Box>
            <Divider/>
            <Box className={"services"}>
                <Stack direction={"row"} gap={"5rem"}>
                    <Stack direction={"column"} gap={"0.5rem"}>
                        <Shimmer height={16} width={80}/>
                        <Stack direction="row"
                               alignItems="center"
                               sx={{gap: '0.5rem'}}>
                            <Shimmer circular={true} height={48} width={48}/>
                            <Stack>
                                <Shimmer height={16} width={100}/>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction={"column"} gap={"0.5rem"}>
                        <Shimmer height={16} width={100}/>
                        <Shimmer circular={true} height={32} width={160}/>
                    </Stack>
                </Stack>

            </Box>
        </Box>
    )
}

export default LeadCreatedShortShimmer;