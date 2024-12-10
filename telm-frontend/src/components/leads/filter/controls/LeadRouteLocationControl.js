import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {ListAltOutlined} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import React from "react";

const LeadRouteLocationControl = ({onChange, value, routes}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="route-select-label">Route</InputLabel>
            <Select
                labelId="route-select-label"
                id="route-select"
                value={value}
                label="Route"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <ListAltOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All Routes
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                {routes?.map((route, index) => (
                    <MenuItem key={index} value={route.id}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <ColorBox text={route.name}/>
                            {route.name}
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default LeadRouteLocationControl;