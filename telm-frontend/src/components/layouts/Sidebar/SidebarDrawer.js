import Drawer from '@mui/material/Drawer';
import Sidebar from "../Sidebar/Sidebar";
import Image from "next/image";
import {Box} from "@mui/material";

const SidebarDrawer = ({open, handleClose, user}) => {
    return (
        <Drawer
            open={open}

            onClose={handleClose}
        >
            <Box sx={{padding: '1rem 1rem 0'}} display={'flex'}>
                <Image src={"/images/logo-menu.png"} width={"103"} height={"40"} alt={"logo"}/>
            </Box>
            <Sidebar user={user}/>
        </Drawer>
    )
}
export default SidebarDrawer;