import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import {ToggleOnRounded} from "@mui/icons-material";
import React from "react";

const StatusFilterControl = ({onChange, value, type}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="Status-select-label">Status</InputLabel>
            <Select
                labelId="Status-select-label"
                id="Status-select"
                value={value}
                label="Status"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <ToggleOnRounded fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                <MenuItem value={1}>Open</MenuItem>
                <MenuItem value={0}>Closed</MenuItem>
                {type === 'lead' &&
                    <MenuItem value={3}>Hold</MenuItem>
                }
            </Select>
        </FormControl>
    )
}
export default StatusFilterControl