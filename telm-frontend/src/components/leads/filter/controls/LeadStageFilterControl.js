import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {ListAltOutlined} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import React from "react";

const LeadStageFilterControl = ({onChange, value, stages, label = "Lead Stage"}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="services-select-label">{label}</InputLabel>
            <Select
                labelId="stage-select-label"
                id="stage-select"
                value={value}
                label={label}
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <ListAltOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                {stages?.map((stage, index) => (
                    <MenuItem key={index} value={stage.id}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <ColorBox text={stage.name}/>
                            {stage.name}
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default LeadStageFilterControl;