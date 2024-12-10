import {ListItem, Typography} from "@mui/material";
import {
    AccountIcon,
    DashboardIcon,
    ExecutivesIcon,
    FollowUpIcon,
    JobsIcon,
    LeadsIcon,
    ReportsIcon
} from "@/components/layouts/Sidebar/NavIcons";
import React from "react";
import ListItemLink from "@/components/layouts/Sidebar/ListItemLink";

const ManagerSidebar = () => {

    return (
        <>
            <ListItemLink
                icon={DashboardIcon}
                text="Dashboard"
                href="/manager/dashboard"
            />
            <ListItem>
                <Typography sx={{color: '#707070'}} variant="body2">
                    Modules
                </Typography>
            </ListItem>
            <ListItemLink
                icon={ExecutivesIcon}
                text="Executives"
                href="/manager/executives"
            />
            <ListItemLink
                icon={LeadsIcon}
                text="Leads"
                href="/manager/leads"
            />
            <ListItemLink
                icon={JobsIcon}
                text="Jobs"
                href="/manager/jobs"
            />

            <ListItemLink
                icon={FollowUpIcon}
                text="Follow Ups"
                href="/manager/follow-ups"
            />

            <ListItemLink
                icon={ReportsIcon}
                text="Reports"
                href="/manager/reports"
            />

            <ListItem>
                <Typography sx={{color: '#707070'}} variant="body2">
                    Settings
                </Typography>
            </ListItem>

            <ListItemLink
                icon={AccountIcon}
                text="Account Settings"
                href="/manager/account"
            />
        </>
    )
}

export default ManagerSidebar;