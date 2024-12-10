import React from "react";
import {Box, List} from "@mui/material";
import AdminSidebar from "@/components/layouts/Sidebar/RoleNav/AdminSidebar";
import ManagerSidebar from "@/components/layouts/Sidebar/RoleNav/ManagerSidebar";
import ExecutiveSidebar from "@/components/layouts/Sidebar/RoleNav/ExecutiveSidebar";


const Sidebar = ({user}) => {

    return (
        <Box sx={{
            display: 'flex', width: '14.375rem',
            background: '#fff',
            minHeight: '100vh',
            padding: '1.5rem 0.5rem',
            minWidth: {
                xs: '17rem',
                md: 'auto'
            },
            boxShadow: {
                md: '0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
            }
        }}
        >
            <List component="ul" sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {user.role === 'admin' &&
                    <AdminSidebar/>
                }
                {user.role === 'manager' &&
                    <ManagerSidebar/>
                }
                {user.role === 'executive' &&
                    <ExecutiveSidebar/>
                }

            </List>

        </Box>
    )
}

export default Sidebar;