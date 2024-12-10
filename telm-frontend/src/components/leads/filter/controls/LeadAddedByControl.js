import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import UserAvatar from "@/components/common/UserAvatar";
import React from "react";

const LeadAddedByControl = ({onChange, users, value}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="createdBy-select-label">Created By</InputLabel>
            <Select
                labelId="createdBy-select-label"
                id="createdBy-select"
                value={value}
                label="Created By"
                sx={{background: '#fff'}}
                onChange={(event) => onChange(event.target.value)}
            >
                <MenuItem value={'all'}>
                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                        <Avatar sx={{width: 24, height: 24}}/>
                        <Typography>
                            All Executives
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider/>

                {users?.map((user, index) => (
                    <MenuItem key={index} value={user.id}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <UserAvatar name={user.name} small={true}/>
                            {user.name}
                        </Stack>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
export default LeadAddedByControl;