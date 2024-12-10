import {ListItem, Typography} from "@mui/material";
import {AccountIcon, DashboardIcon, FollowUpIcon, JobsIcon, LeadsIcon} from "@/components/layouts/Sidebar/NavIcons";
import React from "react";
import ListItemLink from "@/components/layouts/Sidebar/ListItemLink";

const ExecutiveSidebar = () => {

    return (
        <>
            <ListItemLink
                icon={DashboardIcon}
                text="Dashboard"
                href="/executive/dashboard"
            />
            <ListItem>
                <Typography sx={{color: '#707070'}} variant="body2">
                    Modules
                </Typography>
            </ListItem>
            <ListItemLink
                icon={LeadsIcon}
                text="Leads"
                href="/executive/leads"
            />
            <ListItemLink
                icon={JobsIcon}
                text="Jobs"
                href="/executive/jobs"
            />

            <ListItemLink
                icon={FollowUpIcon}
                text="Follow Ups"
                href="/executive/follow-ups"
            />

            <ListItem>
                <Typography sx={{color: '#707070'}} variant="body2">
                    Settings
                </Typography>
            </ListItem>

            <ListItemLink
                icon={AccountIcon}
                text="Account Settings"
                href="/executive/account"
            />
        </>
    )
}

export default ExecutiveSidebar;