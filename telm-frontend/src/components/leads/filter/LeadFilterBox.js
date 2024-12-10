import React, {useEffect, useState} from "react";
import {Button, Grid, Stack} from "@mui/material";
import {NotInterested} from "@mui/icons-material";
import {dispatch, useSelector} from "@/store";
import {fetchLeadFilters} from "@/store/slices/leadSlice";
import BranchFilterControl from "@/components/leads/filter/controls/BranchFilterControl";
import LeadAddedByControl from "@/components/leads/filter/controls/LeadAddedByControl";
import JobAssignedControl from "@/components/leads/filter/controls/JobAssignedControl";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useAuth} from "@/hooks/auth";
import ServicesFilterControl from "@/components/leads/filter/controls/ServicesFilterControl";
import LeadClassificationControl from "@/components/leads/filter/controls/LeadClassificationControl";
import LeadUrgencyFilterControl from "@/components/leads/filter/controls/LeadUrgencyFilterControl";
import StatusFilterControl from "@/components/leads/filter/controls/StatusFilterControl";
import FilterBox from "@/components/common/FilterBox";
import Typography from "@mui/material/Typography";
import LeadStageFilterControl from "@/components/leads/filter/controls/LeadStageFilterControl";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import moment from "moment-timezone";
import LeadRouteLocationControl from "@/components/leads/filter/controls/LeadRouteLocationControl";
import LeadLocationsControl from "@/components/leads/filter/controls/LeadLocationsControl";

moment.tz.setDefault('Asia/Dubai');

const LeadFilterBox = ({
                           isCardExpanded,
                           onFilterChange,
                           filterState,
                           filterAppliedCount,
                           onFilterReset,
                           onClickHide
                       }) => {
    const {filters} = useSelector((state) => state.leads);
    const {user} = useAuth({middleware: 'auth'})

    const [createdByUsers, setCreatedByUsers] = useState(filters?.created_by || [])
    const [assignedUsers, setAssignedUsers] = useState(filters?.assigned_to || [])

    useEffect(() => {
        if (isCardExpanded) {
            dispatch(fetchLeadFilters())
        }
    }, [isCardExpanded])

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (filterState.route === 'all') {
            onFilterChange('location', 'all');
        }
    }, [filterState.route])

    useEffect(() => {
        if (user.role === 'admin' && filterState.branch !== 'all') {
            const filteredCreatedByUsers = filters.created_by.filter(user => user.branch_id == filterState.branch);
            const filteredAssignedUsers = filters.assigned_to.filter(user => user.branch_id == filterState.branch);
            setCreatedByUsers(filteredCreatedByUsers);
            setAssignedUsers(filteredAssignedUsers);
        } else {
            setCreatedByUsers(filters.created_by);
            setAssignedUsers(filters.assigned_to);
        }
    }, [filterState.branch, filters, user])


    return (
        <>
            <FilterBox filterAppliedCount={filterAppliedCount} onFilterReset={onFilterReset} onClickHide={onClickHide}
                       isCardExpanded={isCardExpanded}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <LeadStageFilterControl value={filterState.stage} onChange={(selectedValue) =>
                            onFilterChange('stage', selectedValue)} stages={filters?.stages}/>

                    </Grid>

                    {user.role === 'admin' &&
                        <Grid item xs={12}>
                            <BranchFilterControl branches={filters?.branches}
                                                 onChange={(selectedValue) => {
                                                     onFilterChange('created_by', 'all');
                                                     onFilterChange('assigned_to', 'all');
                                                     return onFilterChange('branch', selectedValue)
                                                 }
                                                 }
                                                 value={filterState.branch}/>
                        </Grid>
                    }
                    {user.role !== 'executive' &&
                        <>
                            <Grid item xs={12}>

                                <LeadAddedByControl value={filterState.created_by}
                                                    users={createdByUsers}
                                                    onChange={(selectedValue) =>
                                                        onFilterChange('created_by', selectedValue)}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <JobAssignedControl value={filterState.assigned_to}
                                                    users={assignedUsers}
                                                    showUnassigned={true}
                                                    onChange={(selectedValue) =>
                                                        onFilterChange('assigned_to', selectedValue)}
                                />

                            </Grid>
                        </>
                    }


                    <Grid item xs={12}>
                        <ServicesFilterControl value={filterState.service} onChange={(selectedValue) =>
                            onFilterChange('service', selectedValue)} services={filters?.services}/>

                    </Grid>
                    <Grid item xs={12}>

                        <LeadClassificationControl onChange={(selectedValue) =>
                            onFilterChange('classification', selectedValue)}
                                                   value={filterState.classification}/>

                    </Grid>
                    <Grid item xs={12}>

                        <LeadUrgencyFilterControl onChange={(selectedValue) =>
                            onFilterChange('urgency', selectedValue)}
                                                  value={filterState.urgency}/>

                    </Grid>
                    <Grid item xs={12}>
                        <StatusFilterControl onChange={(selectedValue) =>
                            onFilterChange('status', selectedValue)}
                                             value={filterState.status} type={"lead"}/>
                    </Grid>


                </Grid>

                <Grid item xs={12}>
                    <LeadRouteLocationControl value={filterState.route} onChange={(selectedValue) =>
                        onFilterChange('route', selectedValue)} routes={filters?.routes}/>
                </Grid>
                <Grid item xs={12}>
                    <LeadLocationsControl value={filterState.location} onChange={(selectedValue) =>
                        onFilterChange('location', selectedValue)} locations={filters?.locations}
                                          route={filterState.route}/>
                </Grid>

                <Grid item xs={12}>
                    <Stack direction={"column"} gap={"1rem"}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="From Date"
                                value={filterState.start_date !== 'all' ? filterState.start_date : null}
                                onChange={(date) => {
                                    onFilterChange('start_date', date)
                                }}

                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="To Date"
                                value={filterState.end_date !== 'all' ? filterState.end_date : null}
                                onChange={(date) => {
                                    onFilterChange('end_date', date)
                                }}
                                shouldDisableDate={(date) =>
                                    filterState.start_date ? date.isBefore(filterState.start_date, 'day') : false
                                }

                            />
                        </LocalizationProvider>
                    </Stack>

                </Grid>

                <Grid item xs={12}>
                    <LeadStageFilterControl label={"Lead Source"} value={filterState.source}
                                            onChange={(selectedValue) =>
                                                onFilterChange('source', selectedValue)} stages={filters?.sources}/>

                </Grid>

                <Stack direction={"row"} paddingTop={"1rem"} gap={"1rem"} justifyContent={"space-between"}
                       alignItems={"center"}>
                    <Button onClick={onClickHide}>Close</Button>
                    {filterAppliedCount > 0 &&
                        <Button onClick={onFilterReset} color={"error"} startIcon={<NotInterested/>}>Clear
                            Filters</Button>
                    }
                </Stack>


                {filterAppliedCount > 0 &&
                    <Stack direction={"row"} paddingTop={"1rem"}>
                        <Typography sx={{fontSize: '0.75rem'}}>Total filter applied: {filterAppliedCount}</Typography>

                    </Stack>
                }


            </FilterBox>
        </>
    )
}
export default React.memo(LeadFilterBox);