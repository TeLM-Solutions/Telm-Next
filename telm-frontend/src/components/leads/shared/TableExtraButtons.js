import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from "@/components/common/Icon";
import DeleteIcon from "../../../../public/images/icons/delete.svg";
import React from "react";
import Typography from "@mui/material/Typography";
import {Divider, Stack} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

const TableExtraButtons = ({onClickDelete, onClickHold, leadStatus, id, canDelete = true}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickDelete = (id) => {
        onClickDelete(id)
        handleClose();
    }
    const handleClickDHold = (id, type) => {
        onClickHold(id, type)
        handleClose();
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleClick(event)
                }}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="more-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {leadStatus == 1 &&
                    <MenuItem onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleClickDHold(id, 'hold')
                    }}>
                        <Stack direction={"row"} gap={"0.5rem"}>
                            <PauseCircleOutlineIcon/>
                            <Typography>Hold Lead</Typography>
                        </Stack>

                    </MenuItem>
                }
                {leadStatus == 3 &&
                    <MenuItem onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleClickDHold(id, 'open')
                    }}>
                        <Stack direction={"row"} gap={"0.5rem"}>
                            <PublishedWithChangesIcon/>
                            <Typography>Open Lead</Typography>
                        </Stack>

                    </MenuItem>
                }
                {canDelete &&
                    <>
                        <Divider/>
                        <MenuItem onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleClickDelete(id)
                        }}>
                            <Stack direction={"row"} gap={"0.5rem"}>
                                <Icon src={DeleteIcon} height={20} width={20}/>
                                <Typography>Delete</Typography>
                            </Stack>

                        </MenuItem>
                    </>
                }

            </Menu>
        </div>
    )
}
export default TableExtraButtons