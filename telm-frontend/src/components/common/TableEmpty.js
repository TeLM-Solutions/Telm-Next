import {NewReleasesOutlined} from "@mui/icons-material";
import {Stack, Typography} from "@mui/material";

const TableEmpty = ({message}) => {
    return (
        <Stack direction={"row"}
               gap={"0.5rem"}
               alignItems={"center"}
               justifyContent={"center"}
               sx={{padding: '2rem'}}
        >
            <NewReleasesOutlined color={"action"}/>
            <Typography sx={{fontSize: '0.85rem'}}>
                {message}
            </Typography>
        </Stack>
    )
}
export default TableEmpty;