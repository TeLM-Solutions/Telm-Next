import React from "react";
import {Badge, Box, Button, IconButton, Typography} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import TableSearch from "@/components/common/tableSearch";
import TableCount from "@/components/common/tableCount";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinearProgress from "@mui/material/LinearProgress";
import FilterButton from "@/components/common/FilterButton";
import SearchIcon from "@mui/icons-material/Search";
import TableExportMenu from "@/components/common/TableExportMenu";
import {useAuth} from "@/hooks/auth";

const JobHeader = ({
                       jobs,
                       onClickAdd,
                       showAddButton = true,
                       onSearch,
                       isLoading,
                       isFilterActive,
                       filterAppliedCount,
                       onClickFilter,
                       total,
                       searchQuery,
                       onClickMobileSearch,
                       onClickExportExcel
                   }) => {
    // mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {user} = useAuth({middleware: 'auth'})

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
            className={"page-heading-bar"}
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
                }
            }}>
                <Typography
                    sx={{
                        color: 'rgba(0, 0, 0, 0.87)',
                        lineHeight: '1.8525rem',
                        letterSpacing: '0.01563rem',
                        fontSize: {
                            xs: '1.2rem',
                            md: '1.5rem',
                        },
                        fontWeight: {
                            xs: 600,
                            md: 500
                        },
                    }}
                    component="h1">
                    Jobs
                </Typography>
                <TableCount count={total || 0} vertical={isMobile}/>
            </Box>

            <Box sx={{display: 'flex', gap: '2rem', alignItems: 'center'}}>

                {!isMobile &&
                    <>
                        <FilterButton isFilterActive={isFilterActive} filterAppliedCount={filterAppliedCount}
                                      onClickFilter={onClickFilter}/>
                        <TableSearch label={"Search by business name"} onSearch={onSearch}/>
                    </>
                }
                {showAddButton &&
                    <Button variant="contained" startIcon={<AddOutlined/>} onClick={onClickAdd}>
                        Add {!isMobile && 'New'}
                    </Button>
                }
                {isMobile &&
                    <>
                        <FilterButton isFilterActive={isFilterActive} filterAppliedCount={filterAppliedCount}
                                      onClickFilter={onClickFilter}/>
                        <IconButton onClick={onClickMobileSearch}>
                            <Badge
                                color="error"
                                invisible={searchQuery === ''}
                                variant="dot"
                            >
                                <SearchIcon color={searchQuery === '' ? "" : "error"}/>
                            </Badge>
                        </IconButton>
                    </>
                }
                {(user.role === 'manager' || user.role === 'admin') &&
                    <TableExportMenu onClickExportExcel={onClickExportExcel}/>
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

export default React.memo(JobHeader);