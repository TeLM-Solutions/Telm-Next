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
import {useAuth} from "@/hooks/auth";
import TableExportMenu from "@/components/common/TableExportMenu";
import TableDialyReportMenu from "@/components/common/TableDialyReportMenu";

const LeadHeader = ({
                        leads,
                        onClickAdd,
                        showAddButton = true,
                        onSearch,
                        isLoading,
                        onClickFilter,
                        isFilterActive,
                        filterAppliedCount,
                        total,
                        searchQuery,
                        onClickMobileSearch,
                        onClickExportExcel
                    }) => {
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
                        fontSize: {
                            xs: '1.2rem',
                            md: '1.5rem',
                        },
                        fontWeight: {
                            xs: 600,
                            md: 500
                        },
                        lineHeight: '1.8525rem',
                        letterSpacing: '0.01563rem'
                    }}
                    component="h1">
                    Leads
                </Typography>
                <TableCount count={total || 0} vertical={isMobile}/>
            </Box>

            <Box sx={{display: 'flex', gap: {xs: '1rem', md: '2rem'}, alignItems: 'center'}}>
                <FilterButton isFilterActive={isFilterActive} filterAppliedCount={filterAppliedCount}
                              onClickFilter={onClickFilter}/>

                {!isMobile &&
                    <>

                        <TableSearch label={"Search by business name"} onSearch={onSearch}/>

                    </>
                }
                {showAddButton &&
                    <Button variant="contained" startIcon={<AddOutlined/>} onClick={onClickAdd}>
                        Add {!isMobile && 'New'}
                    </Button>
                }

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
                {(user.role === 'manager' || user.role === 'admin') &&
                    <TableExportMenu onClickExportExcel={onClickExportExcel} showDailyReport={true}/>
                }
                {(user.role === 'executive') &&
                    <TableDialyReportMenu/>
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

export default React.memo(LeadHeader);