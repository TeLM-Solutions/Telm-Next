import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {IconButton, Stack} from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DailyReportDialog from "@/components/common/DailyReportDialog";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const TableDialyReportMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickExport = () => {
        setAnchorEl(null);
        setIsDialogOpen(true)
    }
    const handleDialogClose = () => {
        setIsDialogOpen(false)
    }
    return (
        <>
            <IconButton
                aria-label="more"
                id="more-button"
                aria-controls={open ? 'more-button' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="more-button"
                MenuListProps={{
                    'aria-labelledby': 'more-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

            >
                <MenuItem onClick={handleClickExport}>
                    <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                        <AssignmentTurnedInOutlinedIcon sx={{color: 'rgb(72, 68, 255)'}}/>
                        Daily Reports
                    </Stack>
                </MenuItem>
            </Menu>
            {isDialogOpen &&
                <DailyReportDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}/>
            }
        </>
    )
}
export default TableDialyReportMenu