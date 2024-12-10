import {Badge, Box, Button, IconButton, Typography} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import TableSearch from "@/components/common/tableSearch";
import TableCount from "@/components/common/tableCount";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinearProgress from "@mui/material/LinearProgress";
import React from 'react';
import SearchIcon from "@mui/icons-material/Search";

const ManagerHeader = ({managers, onClickAdd, onSearch, isLoading, total, onClickMobileSearch, searchQuery}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: {
                    xs: '0.5rem 1rem',
                    md: '1rem'
                },
                position: 'relative'

            }}
        >
            <Box sx={{
                display: {
                    xs: 'column',
                    md: 'flex'
                },
                alignItems: {
                    md: 'center'
                }, gap: {
                    md: '1.5rem'
                },
            }}>
                <Typography
                    sx={{
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontSize: {
                            xs: '1.2rem',
                            md: '1.5rem',
                        },
                        lineHeight: '1.8525rem',
                        fontWeight: {
                            xs: 600,
                            md: 500
                        },
                        letterSpacing: '0.01563rem'
                    }}
                    component="h1">
                    Managers
                </Typography>
                <TableCount count={total || 0} vertical={isMobile}/>
            </Box>

            <Box sx={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                {!isMobile &&
                    <TableSearch label={"Search by manager name"} onSearch={onSearch}/>
                }
                <Button variant="contained" startIcon={<AddOutlined/>} onClick={onClickAdd}>
                    Add {!isMobile && 'New'}
                </Button>
                {isMobile &&
                    <IconButton onClick={onClickMobileSearch}>
                        <Badge
                            color="error"
                            invisible={searchQuery === ''}
                            variant="dot"
                        >
                            <SearchIcon color={searchQuery === '' ? "" : "error"}/>
                        </Badge>
                    </IconButton>
                }
            </Box>

            {isLoading &&
                <Box sx={{position: 'absolute', bottom: 0, zIndex: 2, left: 0, right: 0}}>
                    <LinearProgress sx={{height: 2}}/>
                </Box>
            }

        </Box>
    )
}

export default React.memo(ManagerHeader);