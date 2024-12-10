import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import {useAuth} from "@/hooks/auth";
import {useDispatch, useSelector} from "@/store";
import {useCallback, useEffect, useState} from "react";
import {exportToExcel, fetchLeads} from "@/store/slices/leadSlice";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadTable from "@/components/leads/LeadTable";
import LeadViewDialog from "@/components/leads/LeadViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileLeadTable from "@/components/leads/mobile/MobileLeadTable";
import LeadFilterBox from "@/components/leads/filter/LeadFilterBox";
import countChangedValues from "@/lib/countFilterChanges";
import MobileSearch from "@/components/common/MobileSearch";
import {subscribe, unsubscribe} from "@/lib/events";

const Leads = () => {

    // init filter values
    const initialFilterState = {
        branch: 'all',
        created_by: 'all',
        assigned_to: 'all',
        service: 'all',
        classification: 'all',
        urgency: 'all',
        status: 'all',
        stage: 'all',
        start_date: 'all',
        end_date: 'all',
        route: 'all',
        location: 'all',
        source: 'all'
    };

    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewId, setViewId] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {user} = useAuth({middleware: 'auth'})

    const dispatch = useDispatch();
    const {loading, leads, pagination} = useSelector((state) => state.leads);

    // filter
    const [showFilter, setShowFilter] = useState(false);
    const [filterAppliedCount, setFilterAppliedCount] = useState(0);
    const [filterState, setFilterState] = useState(initialFilterState);

    //search
    const [searchQuery, setSearchQuery] = useState('');
    // paging
    const [currentPage, setCurrentPage] = useState(0)

    // mobile search
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // search and pagination
    useEffect(() => {
        dispatch(fetchLeads({
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
            await dispatch(fetchLeads({
                q: searchQuery,
                page: currentPage + 1,
                ...filterState
            }));
        };

        subscribe("job_created_from_lead_view", eventListener);

        return () => {
            unsubscribe("job_created_from_lead_view", eventListener);
        };
    }, [currentPage, dispatch, filterState, searchQuery]);

    const handleClickExportExcel = async () => {
        await dispatch(exportToExcel({
            export_type: 'leads',
            q: searchQuery,
            page: currentPage + 1,
            ...filterState
        }));

    }

    return (
        <DefaultLayout padded={!isMobile}>
            <Card sx={{width: '100%'}} className={isMobile ? "card-mobile-items" : ""}>


                <LeadHeader leads={leads}
                            showAddButton={false}
                            onSearch={handleSearch}
                            isLoading={loading}
                            onClickFilter={handleClickFilter}
                            isFilterActive={showFilter}
                            filterAppliedCount={filterAppliedCount}
                            total={pagination?.total}
                            searchQuery={searchQuery}
                            onClickMobileSearch={handleShowMobileSearch}
                            onClickExportExcel={handleClickExportExcel}
                />

                <Divider/>

                <LeadFilterBox isCardExpanded={showFilter} onFilterChange={handleFilterChange}
                               filterState={filterState} initialFilterState={initialFilterState}
                               filterAppliedCount={filterAppliedCount} onFilterReset={onFilterReset}
                               onClickHide={handleClickFilter}/>
                {isMobile &&
                    <MobileLeadTable loading={loading} leads={leads} user={user}
                                     onClickView={handleViewDialogOpen} pagination={pagination}
                                     onTablePageChange={handlePageChange}/>
                }
                {!isMobile &&
                    <LeadTable loading={loading} leads={leads} user={user} onClickView={handleViewDialogOpen}
                               pagination={pagination}
                               onTablePageChange={handlePageChange}/>
                }
                {isViewDialogOpen &&
                    <LeadViewDialog isDialogOpen={isViewDialogOpen} handleDialogClose={handleViewDialogClose}
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
export default Leads;