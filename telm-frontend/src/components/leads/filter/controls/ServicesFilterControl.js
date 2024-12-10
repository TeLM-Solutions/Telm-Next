import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {ListAltOutlined} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import React from "react";

const ServicesFilterControl = ({onChange, value, services}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="services-select-label">Services</InputLabel>
            <Select
                labelId="services-select-label"
                id="services-select"
                value={value}
                label="Services"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <ListAltOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All Services
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                {services?.map((service, index) => (
                    <MenuItem key={index} value={service.id}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <ColorBox text={service.name}/>
                            {service.name}
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default ServicesFilterControl;