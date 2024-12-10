import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Divider, Select, Stack} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FmdGoodTwoToneIcon from "@mui/icons-material/FmdGoodTwoTone";
import ColorBox from "@/components/common/ColorBox";

const ReportBranchSelect = ({handleChange, branch, branches}) => {

    return (

        <FormControl fullWidth>
            <InputLabel sx={{fontWeight: 700}} id="branch-select-label">Branch</InputLabel>
            <Select
                labelId="branch-select-label"
                id="branch-select"
                value={branch}
                label="Branch"
                onChange={handleChange}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"}
                           alignItems={"center"}><FmdGoodTwoToneIcon color={"secondary"}/> All
                        Branches</Stack>
                </MenuItem>
                <Divider/>
                {branches.map((branch, index) => (
                    <MenuItem key={index} value={branch.id}>
                        <Stack direction={"row"} gap={"0.5rem"}
                               alignItems={"center"}><ColorBox text={branch.name}/>{branch.name}</Stack>
                    </MenuItem>
                ))}

            </Select>
        </FormControl>
    )

}
export default ReportBranchSelect;