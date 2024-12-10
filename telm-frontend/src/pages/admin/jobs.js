import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useCallback, useEffect, useState} from "react";
import {fetchJobs} from "@/store/slices/jobSlice";
import JobHeader from "@/components/jobs/JobHeader";
import JobTable from "@/components/jobs/JobTable";
import {useAuth} from "@/hooks/auth";
import JobViewDialog from "@/components/jobs/JobViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileJobTable from "@/components/jobs/mobile/MobileJobTable";
import countChangedValues from "@/lib/countFilterChanges";
import JobFilterBox from "@/components/jobs/filters/JobFilterBox";
import MobileSearch from "@/components/common/MobileSearch";
import {subscribe, unsubscribe} from "@/lib/events";
import {exportToExcel} from "@/store/slices/leadSlice";

const Jobs = () => {

    const initialFilterState = {
        branch: 'all',
        assigned_to: 'all',
        service: 'all',
        classification: 'all',
        urgency: 'all',
        status: 'all',
        start_date: 'all',
        end_date: 'all',
        stage: 'all',
    };

    const {user} = useAuth({middleware: 'auth'})

    const dispatch = useDispatch();
    const {loading, jobs, pagination} = useSelector((state) => state.jobs);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    // search and pagination
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

    // view
    const handleViewDialogOpen = (id) => {
        setViewId(id)
        setIsViewDialogOpen(true);
    }
    const handleViewDialogClose = () => {
        setViewId(null)
        setIsViewDialogOpen(false);
    }

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
    }, [currentPage, dispatch, filterState, searchQuery]);

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
                           showAddButton={false}
                           onSearch={handleSearch}
                           isLoading={loading}
                           isFilterActive={showFilter}
                           filterAppliedCount={filterAppliedCount}
                           onClickFilter={handleClickFilter}
                           total={pagination?.total}
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
                    <JobTable loading={loading} jobs={jobs} user={user}
                              onViewClick={handleViewDialogOpen} pagination={pagination}
                              onTablePageChange={handlePageChange}/>
                }
                {isMobile &&
                    <MobileJobTable loading={loading} jobs={jobs} user={user}
                                    onViewClick={handleViewDialogOpen} pagination={pagination}
                                    onTablePageChange={handlePageChange}/>
                }
                {isViewDialogOpen &&
                    <JobViewDialog isDialogOpen={isViewDialogOpen} handleDialogClose={handleViewDialogClose}
                                   id={viewId}/>
                }
                {isMobile &&
                    <MobileSearch onClose={handleHideMobileSearch} isOpen={showMobileSearch} onSearch={handleSearch}
                                  searchQuery={searchQuery}/>
                }
            </Card>
        </DefaultLayout>
    )
}
export default Jobs;