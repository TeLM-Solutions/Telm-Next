import React, {useEffect, useState} from "react";
import {Button, Grid, Stack} from "@mui/material";
import {NotInterested} from "@mui/icons-material";
import {dispatch, useSelector} from "@/store";
import BranchFilterControl from "@/components/leads/filter/controls/BranchFilterControl";
import JobAssignedControl from "@/components/leads/filter/controls/JobAssignedControl";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import moment from 'moment-timezone';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useAuth} from "@/hooks/auth";
import ServicesFilterControl from "@/components/leads/filter/controls/ServicesFilterControl";
import LeadClassificationControl from "@/components/leads/filter/controls/LeadClassificationControl";
import LeadUrgencyFilterControl from "@/components/leads/filter/controls/LeadUrgencyFilterControl";
import StatusFilterControl from "@/components/leads/filter/controls/StatusFilterControl";
import FilterBox from "@/components/common/FilterBox";
import {fetchJobFilters} from "@/store/slices/jobSlice";
import Typography from "@mui/material/Typography";
import LeadStageFilterControl from "@/components/leads/filter/controls/LeadStageFilterControl";

moment.tz.setDefault('Asia/Dubai');

const JobFilterBox = ({
                          isCardExpanded,
                          onFilterChange,
                          filterState,
                          filterAppliedCount,
                          onFilterReset,
                          onClickHide
                      }) => {
    const {filters} = useSelector((state) => state.jobs);
    const {user} = useAuth({middleware: 'auth'})
    const [assignedUsers, setAssignedUsers] = useState(filters?.assigned_to || [])

    useEffect(() => {
        if (isCardExpanded) {
            dispatch(fetchJobFilters())
        }
    }, [isCardExpanded])

    useEffect(() => {
        if (user.role === 'admin' && filterState.branch !== 'all') {
            const filteredAssignedUsers = filters.assigned_to.filter(user => user.branch_id == filterState.branch);
            setAssignedUsers(filteredAssignedUsers);
        } else {
            setAssignedUsers(filters.assigned_to);
        }
    }, [filterState.branch, filters])

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
                                                 onChange={(selectedValue) =>
                                                     onFilterChange('branch', selectedValue)}
                                                 value={filterState.branch}/>
                        </Grid>
                    }
                    {(user.role === 'manager' || user.role === 'admin') &&
                        <Grid item xs={12}>

                            <JobAssignedControl value={filterState.assigned_to}
                                                users={assignedUsers}
                                                showUnassigned={false}
                                                onChange={(selectedValue) =>
                                                    onFilterChange('assigned_to', selectedValue)}
                            />

                        </Grid>
                    }


                    <Grid item xs={12}>
                        <Stack direction={"column"} gap={"1rem"}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="Start Date"
                                    value={filterState.start_date !== 'all' ? filterState.start_date : null}
                                    onChange={(date) => {
                                        onFilterChange('start_date', date)
                                    }}

                                />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    label="End Date"
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
                                             value={filterState.status} type={"job"}/>
                    </Grid>
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
export default React.memo(JobFilterBox);