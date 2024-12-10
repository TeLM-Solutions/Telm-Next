import InputLabel from "@mui/material/InputLabel";
import {Divider, FormControl, MenuItem, Select, Stack, Typography} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {PersonOffOutlined} from "@mui/icons-material";
import UserAvatar from "@/components/common/UserAvatar";
import React from "react";

const JobAssignedControl = ({onChange, users, value, showUnassigned = true}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="job-assigned-select-label">Job Assigned To</InputLabel>
            <Select
                labelId="job-assigned-select-label"
                id="job-assigned-select"
                value={value}
                label="Job Assigned To"
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
                {showUnassigned &&
                    <MenuItem value={'unassigned'}>
                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                            <Avatar sx={{width: 24, height: 24, bgcolor: '#ff6b00'}}>
                                <PersonOffOutlined fontSize={"small"}/>
                            </Avatar>
                            <Typography>
                                Unassigned Jobs
                            </Typography>
                        </Stack>
                    </MenuItem>
                }
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

export default JobAssignedControl