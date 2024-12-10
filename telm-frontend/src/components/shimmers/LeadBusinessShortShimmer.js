import {Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import Shimmer from "@/components/shimmers/ShimmerBase";

const LeadBusinessShortShimmer = ({title = 'Business'}) => {
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading"}>
                <Typography>{title}</Typography>
                <Shimmer height={10} width={50}/>
            </Box>
            <Divider/>
            <Box className={"services"}>

                <Stack direction={"row"} gap={"3rem"}>

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Shimmer height={10} width={50}/>
                        <Shimmer height={10} width={80}/>

                    </Stack>

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Shimmer height={10} width={50}/>
                        <Shimmer height={10} width={80}/>

                    </Stack>

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Shimmer height={10} width={50}/>
                        <Shimmer height={10} width={120}/>

                    </Stack>

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Shimmer height={10} width={50}/>
                        <Shimmer height={10} width={120}/>

                    </Stack>

                </Stack>

            </Box>
            <Divider/>
        </Box>
    )
}

export default LeadBusinessShortShimmer;