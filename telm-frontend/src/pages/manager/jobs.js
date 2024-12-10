import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import React, {useCallback, useEffect, useState} from "react";
import {fetchJobs} from "@/store/slices/jobSlice";
import JobHeader from "@/components/jobs/JobHeader";
import JobTable from "@/components/jobs/JobTable";
import JobFormDialog from "@/components/jobs/JobFormDialog";
import {useAuth} from "@/hooks/auth";
import JobViewDialog from "@/components/jobs/JobViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileJobTable from "@/components/jobs/mobile/MobileJobTable";
import countChangedValues from "@/lib/countFilterChanges";
import JobFilterBox from "@/components/jobs/filters/JobFilterBox";
import Snack from "@/components/common/Snack";
import MobileSearch from "@/components/common/MobileSearch";
import {subscribe, unsubscribe} from "@/lib/events";
import {exportToExcel} from "@/store/slices/leadSlice";

const Jobs = () => {

    const initialFilterState = {
        assigned_to: 'all',
        service: 'all',
        classification: 'all',
        urgency: 'all',
        status: 'all',
        start_date: 'all',
        end_date: 'all',
        stage: 'all',
    };

    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const {user} = useAuth({middleware: 'auth'})

    const dispatch = useDispatch();
    const {loading, jobs, pagination} = useSelector((state) => state.jobs);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // view
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewId, setViewId] = useState(null);

    //search
    const [searchQuery, setSearchQuery] = useState('');
    // paging
    const [currentPage, setCurrentPage] = useState(0)

    // filter
    const [showFilter, setShowFilter] = useState(false);
    const [filterAppliedCount, setFilterAppliedCount] = useState(0);
    const [filterState, setFilterState] = useState(initialFilterState);

    // mobile search
    const [showMobileSearch, setShowMobileSearch] = useState(false);


    useEffect(() => {
        dispatch(fetchJobs({
            q: searchQuery,
            page: currentPage + 1,
            ...filterState
        }));
    }, [dispatch, searchQuery, currentPage, filterState]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setCurrentPage(0); // Reset currentPage when a new search is initiated
    }, []);

    const handlePageChange = useCallback((event, newPage) => {
        setCurrentPage(newPage);
    }, []);

    // filter
    const handleClickFilter = () => {
        setShowFilter(!showFilter)
    }

    const handleFilterChange = useCallback((filterName, value) => {
        setCurrentPage(0);
        setFilterState((prevState) => ({
            ...prevState,
            [filterName]: value,
        }));
    }, []);

    // check if filter applied
    useEffect(() => {
        const changedValuesCount = countChangedValues(initialFilterState, filterState);
        setFilterAppliedCount(changedValuesCount)
    }, [filterState])

    const onFilterReset = useCallback(() => {
        setFilterState(initialFilterState)
    }, [])

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (jobId) => {
        const toEdit = jobs.find((job) => job.id === jobId);

        if (toEdit) {
            setEditData(toEdit);
            setDialogOpen(true);
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditData(null);
    };

    // view
    const handleViewDialogOpen = (id) => {
        setViewId(id)
        setIsViewDialogOpen(true);
    }
    const handleViewDialogClose = () => {
        setViewId(null)
        setIsViewDialogOpen(false);
    }

    const handleSuccess = (isUpdate = false) => {
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Job updated successfully')
        } else {
            setSnackMessage('Job created successfully')
        }
    }

    // mobile search
    const handleShowMobileSearch = () => {
        setShowMobileSearch(true)
    }
    const handleHideMobileSearch = () => {
        setShowMobileSearch(false)
    }

    useEffect(() => {
        const eventListener = async () => {
            dispatch(fetchJobs({
                q: searchQuery,
                page: currentPage + 1,
                ...filterState
            }));
        };

        subscribe("reload_jobs_table", eventListener);

        return () => {
            unsubscribe("reload_jobs_table", eventListener);
        };
    }, []);

    const handleClickExportExcel = async () => {
        await dispatch(exportToExcel({
            export_type: 'jobs',
            q: searchQuery,
            ...filterState
        }));
    }

    return (
        <DefaultLayout padded={!isMobile}>
            <Card sx={{width: '100%'}} className={isMobile ? "card-mobile-items" : ""}>

                <JobHeader jobs={jobs}
                           onSearch={handleSearch}
                           isLoading={loading}
                           isFilterActive={showFilter}
                           filterAppliedCount={filterAppliedCount}
                           onClickFilter={handleClickFilter}
                           total={pagination?.total}
                           onClickAdd={handleDialogOpen}
                           searchQuery={searchQuery}
                           onClickMobileSearch={handleShowMobileSearch}
                           onClickExportExcel={handleClickExportExcel}
                />
                <Divider/>

                <JobFilterBox
                    isCardExpanded={showFilter}
                    onFilterChange={handleFilterChange}
                    filterState={filterState}
                    initialFilterState={initialFilterState}
                    filterAppliedCount={filterAppliedCount}
                    onFilterReset={onFilterReset}
                    onClickHide={handleClickFilter}
                />

                {!isMobile &&
                    <JobTable loading={loading} jobs={jobs} onClickEdit={handleOnClickEdit} user={user}
                              onViewClick={handleViewDialogOpen} pagination={pagination}
                              onTablePageChange={handlePageChange}/>
                }
                {isMobile &&
                    <MobileJobTable loading={loading} jobs={jobs} onClickEdit={handleOnClickEdit} user={user}
                                    onViewClick={handleViewDialogOpen} pagination={pagination}
                                    onTablePageChange={handlePageChange}/>
                }
                {isDialogOpen &&
                    <JobFormDialog handleDialogClose={handleDialogClose} isDialogOpen={isDialogOpen}
                                   initialData={editData} initialFilterState={initialFilterState}
                                   onSuccess={handleSuccess}/>
                }
                {isViewDialogOpen &&
                    <JobViewDialog isDialogOpen={isViewDialogOpen} handleDialogClose={handleViewDialogClose}
                                   id={viewId}/>
                }

                {isMobile &&
                    <MobileSearch onClose={handleHideMobileSearch} isOpen={showMobileSearch} onSearch={handleSearch}
                                  searchQuery={searchQuery}/>
                }

                <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>

            </Card>
        </DefaultLayout>
    )
}
export default Jobs;