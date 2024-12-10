import {Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import Shimmer from "@/components/shimmers/ShimmerBase";

const LeadJobShortShimmer = () => {
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading"}>
                <Typography>Job Info</Typography>
            </Box>
            <Divider/>
            <Box className={"services"}>

                <Stack direction={"row"} gap={"5rem"}>

                    <Stack direction={"column"} gap={"0.5rem"}>

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

                        <Shimmer height={10} width={50}/>
                        <Shimmer height={10} width={120}/>

                    </Stack>

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Shimmer height={10} width={50}/>
                        <Shimmer height={8} width={120}/>
                        <Shimmer height={8} width={160}/>

                    </Stack>

                </Stack>

            </Box>
            <Divider/>
        </Box>
    )
}

export default LeadJobShortShimmer;