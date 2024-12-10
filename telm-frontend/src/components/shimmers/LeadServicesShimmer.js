import {Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import Shimmer from "@/components/shimmers/ShimmerBase";

const LeadServicesShimmer = () => {
    return (
        <Box sx={{
            ...StyledPaper,
            minHeight: '230px'
        }}>
            <Box className={"heading"}>
                <Typography>Services</Typography>
                <Shimmer height={10} width={80}/>
            </Box>
            <Divider/>
            <Box className={"services"}>
                {[1, 2, 3].map(item => (
                    <Stack key={item} direction={"row"} sx={{padding: '1rem 0'}}
                           justifyContent={"space-between"} alignItems={"center"}>
                        <Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
                            <Shimmer height={10} width={200}/>
                        </Stack>
                        <Shimmer height={10} width={100}/>
                    </Stack>
                ))}

            </Box>
            <Divider/>
            <Box className={"heading"}>
                <Shimmer height={10} width={80}/>
                <Shimmer height={10} width={100}/>
            </Box>
        </Box>
    )
}
export default LeadServicesShimmer;