import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Divider, IconButton, Stack} from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconExcel from "../../../public/images/icons/icon-excel.svg";
import Icon from "@/components/common/Icon";
import {useAuth} from "@/hooks/auth";
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import DailyReportDialog from "@/components/common/DailyReportDialog";

const TableExportMenu = ({onClickExportExcel, showDailyReport = false}) => {
    const {user} = useAuth({middleware: 'auth'})

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickExportExcel = () => {
        onClickExportExcel()
        setAnchorEl(null);
    }

    const handleClickDailyReport = () => {
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
                <MenuItem onClick={handleClickExportExcel}>
                    <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                        <Icon src={IconExcel} height={24} width={24}/>
                        Export to Excel
                    </Stack>
                </MenuItem>
                {user.role === 'manager' && showDailyReport &&
                    <>
                        <Divider/>

                        <MenuItem onClick={handleClickDailyReport}>
                            <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                                <AssignmentTurnedInOutlinedIcon sx={{color: 'rgb(72, 68, 255)'}}/>
                                Daily Report
                            </Stack>
                        </MenuItem>
                    </>
                }
            </Menu>
            {isDialogOpen &&
                <DailyReportDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}/>
            }
        </>
    )
}
export default TableExportMenu