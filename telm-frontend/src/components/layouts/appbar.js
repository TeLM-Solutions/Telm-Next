import React, {useState} from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Image from "next/image";
import Icon from "../common/Icon";
import locationIcon from '../../../public/images/icons/nav-location.svg';
import {Chip, IconButton} from "@mui/material";
import UserMenu from "@/components/layouts/Sidebar/UserMenu";
import {MenuOutlined} from "@mui/icons-material";
import SidebarDrawer from "@/components/layouts/Sidebar/SidebarDrawer";

const Appbar = ({user, isMobile}) => {
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(false);

    const handleOpenSidebar = () => {
        setOpenSidebarDrawer(true);
    }

    const handleCloseSidebar = () => {
        setOpenSidebarDrawer(false);
    }


    return (
        <>
            <Box sx={{flexGrow: 1}}>
                <AppBar position={isMobile ? "fixed" : "relative"} sx={{zIndex: '9'}}>
                    <Toolbar>
                        <Box sx={{flexGrow: 1, display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            {isMobile &&
                                <IconButton onClick={handleOpenSidebar}>
                                    <MenuOutlined/>
                                </IconButton>
                            }

                            <Image src={"/images/logo-menu.png"} width={"130"} height={"40"} alt={"logo"}/>
                            {user.role !== 'admin' &&
                                <Chip
                                    sx={{
                                        borderColor: '#4844FF',
                                        padding: '0.5rem 0.25rem',
                                        color: '#453E98'
                                    }}
                                    icon={<Icon src={locationIcon} width={14} height={16}/>}
                                    label={isMobile ? <strong>{user.branch}</strong> :
                                        <Box>Branch <strong>{user.branch}</strong></Box>}
                                    variant="outlined"/>
                            }
                        </Box>

                        <Box sx={{flexGrow: 0, display: 'flex', gap: '1rem'}}>
                            <UserMenu user={user} isMobile={isMobile}/>
                        </Box>
                    </Toolbar>
                </AppBar>

            </Box>
            {isMobile &&
                <SidebarDrawer open={openSidebarDrawer} handleClose={handleCloseSidebar} user={user}/>
            }
        </>
    )
}
export default React.memo(Appbar);