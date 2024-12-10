import Box from "@mui/material/Box";
import {Avatar, Button, Divider, Typography} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Popover from "@mui/material/Popover";
import {useState} from "react";
import {useAuth} from "@/hooks/auth";

const UserMenu = ({user, isMobile}) => {

    const [userPopover, setUserPopover] = useState(null);
    const handleUserPopoverClick = (event) => {
        setUserPopover(event.currentTarget);
    };

    const handleUserPopoverClose = () => {
        setUserPopover(null);
    };
    const open = Boolean(userPopover);
    const {logout} = useAuth();

    return (
        <>
            <Button
                onClick={handleUserPopoverClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: {
                        md: '1rem'
                    },
                    textTransform: 'capitalize',
                    padding: {
                        xs: '0',
                        md: '0.25rem 1rem 0.25rem 0.375rem'
                    },
                    borderRadius: '4rem',
                    background: {
                        xs: 'none',
                        md: "linear-gradient(156deg, #D3D2FF 0%, #F0F0FF 100%)"
                    },
                    cursor: 'pointer',
                    minWidth: {
                        xs: 'auto'
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >

                    <Avatar
                        sx={{bgcolor: '#6F74FF', width: '32px', height: '32px'}}></Avatar>
                    {!isMobile &&
                        <Box

                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Typography variant="body2"
                                        sx={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: '0.875rem',
                                            lineHeight: '143%',
                                            fontWeight: '500',
                                            letterSpacing: '0.01063rem',
                                            display: {
                                                sm: 'block',
                                            },
                                        }}
                            >
                                {user.name}

                            </Typography>
                            <Typography variant="body2"
                                        sx={{
                                            color: '#555',
                                            fontSize: '0.675rem',
                                            lineHeight: '143%',
                                            fontWeight: '400',
                                            textTransform: 'capitalize',
                                            letterSpacing: '0.01063rem',
                                            display: {
                                                sm: 'block',
                                            },
                                        }}
                            >
                                {user.role}

                            </Typography>

                        </Box>
                    }

                </Box>
                {!isMobile &&
                    <ArrowDropDownIcon sx={{
                        display: {
                            sm: 'block',
                        }
                    }}/>
                }


            </Button>
            <Popover
                open={open}
                anchorEl={userPopover}
                onClose={handleUserPopoverClose}
                disableScrollLock={true}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}

                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box sx={{
                    p: {
                        md: "1rem"
                    },
                    width: '12rem'
                }}>
                    {isMobile &&

                        <>
                            <Box

                                sx={{
                                    display: 'flex',
                                    padding: '0.5rem 1rem',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Typography variant="body2"
                                            sx={{
                                                color: 'rgba(0, 0, 0, 0.87)',
                                                fontSize: '0.875rem',
                                                lineHeight: '143%',
                                                fontWeight: '500',
                                                letterSpacing: '0.01063rem',
                                                display: {
                                                    sm: 'block',
                                                },
                                            }}
                                >
                                    {user.name}

                                </Typography>
                                <Typography variant="body2"
                                            sx={{
                                                color: '#555',
                                                fontSize: '0.675rem',
                                                lineHeight: '143%',
                                                fontWeight: '400',
                                                textTransform: 'capitalize',
                                                letterSpacing: '0.01063rem',
                                                display: {
                                                    sm: 'block',
                                                },
                                            }}
                                >
                                    {user.role}

                                </Typography>

                            </Box>
                            <Divider/>
                        </>

                    }
                    <Button onClick={logout} sx={{width: '100%'}} startIcon={<ExitToAppIcon/>}>Logout</Button>
                </Box>
            </Popover>
        </>
    )
}
export default UserMenu