import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {ListAltOutlined} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import React from "react";

const LeadLocationsControl = ({onChange, value, locations, route}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="locations-select-label">Location</InputLabel>
            <Select
                labelId="locations-select-label"
                id="locations-select"
                value={value}
                label="Location"
                disabled={route === 'all'}
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <ListAltOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All Locations
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                {locations?.filter(location => location.route_id === route).map((location, index) => (
                    <MenuItem key={index} value={location.id}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <ColorBox text={location.name}/>
                            {location.name}
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default LeadLocationsControl;