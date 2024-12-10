import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import {WhatshotOutlined} from "@mui/icons-material";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";
import React from "react";

const LeadClassificationControl = ({onChange, value}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="Classification-select-label">Lead Classification</InputLabel>
            <Select
                labelId="Classification-select-label"
                id="Classification-select"
                value={value}
                label="Lead Classification"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <WhatshotOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                        <Typography>
                            All Classifications
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>
                <MenuItem value={0}>
                    <LeadStatusTiny lead_status={0} large={true}/>
                </MenuItem>
                <MenuItem value={1}>
                    <LeadStatusTiny lead_status={1} large={true}/>
                </MenuItem>
                <MenuItem value={2}>
                    <LeadStatusTiny lead_status={2} large={true}/>
                </MenuItem>
            </Select>
        </FormControl>
    )
}
export default LeadClassificationControl;