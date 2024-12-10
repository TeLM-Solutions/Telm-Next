import Shimmer from "@/components/shimmers/ShimmerBase";
import Stack from "@mui/material/Stack";

const BusinessNameShimmer = () => {
    return (
        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
            <Shimmer height={64} width={64}/>
            <Stack gap={"0.5rem"}>
                <Shimmer height={16} width={160}/>
                <Shimmer height={10} width={50}/>
            </Stack>
        </Stack>
    )
}
export default BusinessNameShimmer;