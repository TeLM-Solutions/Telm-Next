import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {CrisisAlertOutlined} from "@mui/icons-material";
import React from "react";

const LeadUrgencyFilterControl = ({onChange, value}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="Urgency-select-label">Urgency</InputLabel>
            <Select
                labelId="Urgency-select-label"
                id="Urgency-select"
                value={value}
                label="Urgency"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <CrisisAlertOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                <MenuItem value={0}>
                    Low
                </MenuItem>
                <MenuItem value={1}>
                    High
                </MenuItem>
            </Select>
        </FormControl>
    )
}
export default LeadUrgencyFilterControl