import {ListItem, Typography} from "@mui/material";
import {
    AccountIcon,
    BranchesIcon,
    DashboardIcon,
    FollowUpIcon,
    JobsIcon,
    LeadsIcon,
    ManagersIcon,
    ReportsIcon,
    RoutesIcon
} from "@/components/layouts/Sidebar/NavIcons";
import React from "react";
import ListItemLink from "@/components/layouts/Sidebar/ListItemLink";

const AdminSidebar = () => {

    return (
        <>
            <ListItemLink
                icon={DashboardIcon}
                text="Dashboard"
                href="/admin/dashboard"
            />
            <ListItem>
                <Typography sx={{color: '#707070'}} variant="body2">
                    Modules
                </Typography>
            </ListItem>
            <ListItemLink
                icon={BranchesIcon}
                text="Branches"
                href="/admin/branches"
            />
            <ListItemLink
                icon={ManagersIcon}
                text="Managers"
                href="/admin/managers"
            />
            <ListItemLink
                icon={LeadsIcon}
                text="Leads"
                href="/admin/leads"
            />
            <ListItemLink
                icon={JobsIcon}
                text="Jobs"
                href="/admin/jobs"
            />
            <ListItemLink
                icon={FollowUpIcon}
                text="Follow Ups"
                href="/admin/follow-ups"
            />
            <ListItemLink
                icon={RoutesIcon}
                text="Data Management"
                parent={true}
                parentHref="/admin/data"
                href="/admin/data/services"
            />

            <ListItemLink
                icon={ReportsIcon}
                text="Reports"
                href="/admin/reports"
            />

            <ListItem>
                <Typography sx={{color: '#707070'}} variant="body2">
                    Settings
                </Typography>
            </ListItem>

            <ListItemLink
                icon={AccountIcon}
                text="Account Settings"
                href="/admin/account"
            />
        </>
    )
}

export default AdminSidebar;