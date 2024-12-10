import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {LocationOnOutlined} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import React from "react";

const BranchFilterControl = ({onChange, branches, value}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="Branch-select-label">Branch</InputLabel>
            <Select
                labelId="Branch-select-label"
                id="Branch-select"
                value={value}
                label="Branch"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <LocationOnOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All Branches
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>

                {branches?.map((branch, index) => (
                    <MenuItem key={index} value={branch.id}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <ColorBox text={branch.name}/>
                            {branch.name}
                        </Stack>
                    </MenuItem>
                ))}

            </Select>
        </FormControl>
    )
}
export default BranchFilterControl;