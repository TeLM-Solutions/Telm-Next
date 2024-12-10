import React, {useEffect} from "react";
import {Button, Divider, FormControl, Grid, MenuItem, Select, Stack, Typography} from "@mui/material";
import {dispatch, useSelector} from "@/store";
import moment from 'moment-timezone';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useAuth} from "@/hooks/auth";
import FilterBox from "@/components/common/FilterBox";
import {fetchFollowupFilters} from "@/store/slices/followupSlice";
import InputLabel from "@mui/material/InputLabel";
import {LocationOnOutlined, NotInterested} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import BranchFilterControl from "@/components/leads/filter/controls/BranchFilterControl";
import LeadStageFilterControl from "@/components/leads/filter/controls/LeadStageFilterControl";

moment.tz.setDefault('Asia/Dubai');

const FollowUpFilterBox = ({
                               isCardExpanded,
                               onFilterChange,
                               filterState,
                               filterAppliedCount,
                               onFilterReset,
                               onClickHide
                           }) => {
    const {filters} = useSelector((state) => state.followups);
    const {user} = useAuth({middleware: 'auth'})

    useEffect(() => {
        if (isCardExpanded) {
            dispatch(fetchFollowupFilters())
        }
    }, [isCardExpanded])

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
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="Job-select-label">Job</InputLabel>
                            <Select
                                labelId="Job-select-label"
                                id="Job-select"
                                value={filterState?.job_id}
                                label="Job"
                                sx={{background: '#fff'}}
                                onChange={(event) => onFilterChange('job_id', event.target.value)}
                            >
                                <MenuItem value={'all'}>
                                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                        <LocationOnOutlined fontSize={"small"} sx={{color: '#606060'}}/>
                                        <Typography>
                                            All Jobs
                                        </Typography>
                                    </Stack>
                                </MenuItem>
                                <Divider/>

                                {filters?.jobs?.map((job, index) => (
                                    <MenuItem key={index} value={job.id}>
                                        <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                            <ColorBox text={job.name} large={true}/>
                                            {job.name}
                                        </Stack>
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>

                    {/*<Grid item xs={12}>*/}
                    {/*    <FormControl fullWidth>*/}
                    {/*        <InputLabel id="Branch-select-label">Reason</InputLabel>*/}
                    {/*        <Select*/}
                    {/*            labelId="Reasons-select-label"*/}
                    {/*            id="Reasons-select"*/}
                    {/*            value={filterState?.reason_id}*/}
                    {/*            label="Reason"*/}
                    {/*            sx={{background: '#fff'}}*/}
                    {/*            onChange={(event) => onFilterChange('reason_id', event.target.value)}*/}
                    {/*        >*/}
                    {/*            <MenuItem value={'all'}>*/}
                    {/*                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                    <LocationOnOutlined fontSize={"small"} sx={{color: '#606060'}}/>*/}
                    {/*                    <Typography>*/}
                    {/*                        All Reason*/}
                    {/*                    </Typography>*/}
                    {/*                </Stack>*/}
                    {/*            </MenuItem>*/}
                    {/*            <Divider/>*/}

                    {/*            {filters?.reasons?.map((reason, index) => (*/}
                    {/*                <MenuItem key={index} value={reason.id}>*/}
                    {/*                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                        <ColorBox text={reason.name}/>*/}
                    {/*                        {reason.name}*/}
                    {/*                    </Stack>*/}
                    {/*                </MenuItem>*/}
                    {/*            ))}*/}

                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12}>*/}
                    {/*    <LocalizationProvider dateAdapter={AdapterMoment}>*/}
                    {/*        <DatePicker*/}
                    {/*            sx={{width: '100%'}}*/}
                    {/*            label="Follow Up Date"*/}
                    {/*            value={filterState.date !== 'all' ? filterState.date : null}*/}
                    {/*            onChange={(date) => {*/}
                    {/*                onFilterChange('date', date)*/}
                    {/*            }}*/}

                    {/*        />*/}
                    {/*    </LocalizationProvider>*/}
                    {/*</Grid>*/}


                    {/*<Grid item xs={12}>*/}
                    {/*    <FormControl fullWidth>*/}
                    {/*        <InputLabel id="Status-select-label">Status</InputLabel>*/}
                    {/*        <Select*/}
                    {/*            labelId="Status-select-label"*/}
                    {/*            id="Status-select"*/}
                    {/*            value={filterState.status}*/}
                    {/*            label="Status"*/}
                    {/*            sx={{background: '#fff'}}*/}
                    {/*            onChange={(event) => onFilterChange('status', event.target.value)}*/}
                    {/*        >*/}
                    {/*            <MenuItem value={'all'}>*/}
                    {/*                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                    <ToggleOnRounded fontSize={"small"} sx={{color: '#606060'}}/>*/}
                    {/*                    <Typography>*/}
                    {/*                        All*/}
                    {/*                    </Typography>*/}
                    {/*                </Stack>*/}
                    {/*            </MenuItem>*/}
                    {/*            <Divider/>*/}
                    {/*            <MenuItem value={1}>Open</MenuItem>*/}
                    {/*            <MenuItem value={0}>Not Interested</MenuItem>*/}
                    {/*            <MenuItem value={2}>Completed</MenuItem>*/}
                    {/*            <MenuItem value={3}>Rescheduled</MenuItem>*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12}>*/}
                    {/*    <FormControl fullWidth>*/}
                    {/*        <InputLabel id="contact-type-select-label">Contact Type</InputLabel>*/}
                    {/*        <Select*/}
                    {/*            labelId="contact-select-label"*/}
                    {/*            id="contact-select"*/}
                    {/*            value={filterState.contact_type}*/}
                    {/*            label="Contact Type"*/}
                    {/*            sx={{background: '#fff'}}*/}
                    {/*            onChange={(event) => onFilterChange('contact_type', event.target.value)}*/}
                    {/*        >*/}
                    {/*            <MenuItem value={'all'}>*/}
                    {/*                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                    <ToggleOnRounded fontSize={"small"} sx={{color: '#606060'}}/>*/}
                    {/*                    <Typography>*/}
                    {/*                        All*/}
                    {/*                    </Typography>*/}
                    {/*                </Stack>*/}
                    {/*            </MenuItem>*/}
                    {/*            <Divider/>*/}
                    {/*            <MenuItem value={"call"}>*/}
                    {/*                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                    <PermPhoneMsg/>*/}
                    {/*                    <Typography>*/}
                    {/*                        Call*/}
                    {/*                    </Typography>*/}
                    {/*                </Stack>*/}
                    {/*            </MenuItem>*/}
                    {/*            <MenuItem value={"online"}>*/}
                    {/*                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                    <VideoCameraFrontIcon/>*/}
                    {/*                    <Typography>*/}
                    {/*                        Online Meeting*/}
                    {/*                    </Typography>*/}
                    {/*                </Stack>*/}
                    {/*            </MenuItem>*/}
                    {/*            <MenuItem value={"in-person"}>*/}
                    {/*                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>*/}
                    {/*                    <Group/>*/}
                    {/*                    <Typography>*/}
                    {/*                        In-Person*/}
                    {/*                    </Typography>*/}
                    {/*                </Stack>*/}
                    {/*            </MenuItem>*/}
                    {/*        </Select>*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}

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
export default React.memo(FollowUpFilterBox);