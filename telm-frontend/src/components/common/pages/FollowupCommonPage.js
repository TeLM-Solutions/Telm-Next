import DefaultLayout from "@/components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useCallback, useEffect, useState} from "react";
import FollowUpHeader from "@/components/followups/FollowUpHeader";
import FollowUpTable from "@/components/followups/FollowUpTable";
import FollowUpFormDialog from "@/components/followups/FollowUpFormDialog";
import FollowUpViewDialog from "@/components/followups/FollowUpViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileFollowUpTable from "@/components/followups/mobile/MobileFollowUpTable";
import Snack from "@/components/common/Snack";
import FollowUpFilterBox from "@/components/followups/filters/FollowUpFilterBox";
import countChangedValues from "@/lib/countFilterChanges";
import {fetchFollowUps} from "@/store/slices/followupSlice";
import MobileSearch from "@/components/common/MobileSearch";
import {useAuth} from "@/hooks/auth";
import {subscribe, unsubscribe} from "@/lib/events";
import {exportToExcel} from "@/store/slices/leadSlice";

const FollowupCommonPage = ({initialFilterState}) => {

    const {user: loggedUser} = useAuth({middleware: 'auth'})

    const dispatch = useDispatch();
    const {loading, followups, pagination} = useSelector((state) => state.followups);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // view
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewId, setViewId] = useState(null);

    //search
    const [searchQuery, setSearchQuery] = useState('');
    // paging
    const [currentPage, setCurrentPage] = useState(0)

    // snackbar
    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // filter
    const [showFilter, setShowFilter] = useState(false);
    const [filterAppliedCount, setFilterAppliedCount] = useState(0);
    const [filterState, setFilterState] = useState(initialFilterState);

    // mobile search
    const [showMobileSearch, setShowMobileSearch] = useState(false);


    // view
    const handleViewDialogOpen = (id) => {
        setViewId(id)
        setIsViewDialogOpen(true);
    }
    const handleViewDialogClose = () => {
        setViewId(null)
        setIsViewDialogOpen(false);
    }

    useEffect(() => {
        dispatch(fetchFollowUps({
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

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (job_id, followupId) => {
        const toEdit = followups.find((job) => job.id === job_id)?.followups.find((followup) => followup.id === followupId);
        console.log(toEdit)
        if (toEdit) {
            setEditData(toEdit);
            setDialogOpen(true);
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditData(null);
    };

    const handleSuccess = (isUpdate = false) => {
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Followup updated successfully')
        } else {
            setSnackMessage('Followup created successfully')
        }
    }

    // filters
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
            console.log('reload called')
            dispatch(fetchFollowUps({
                q: searchQuery,
                page: currentPage + 1,
                ...filterState
            }));
        };

        subscribe("reload_followups_table", eventListener);

        return () => {
            unsubscribe("reload_followups_table", eventListener);
        };
    }, [currentPage, dispatch, filterState, searchQuery]);

    const handleClickExportExcel = async () => {
        await dispatch(exportToExcel({
            export_type: 'followups',
            q: searchQuery,
            ...filterState
        }));

    }

    return (
        <DefaultLayout padded={!isMobile}>
            <Card sx={{width: '100%'}} className={isMobile ? "card-mobile-items" : ""}>


                <FollowUpHeader
                    followups={followups}
                    onClickAdd={handleDialogOpen}
                    isLoading={loading}
                    total={pagination?.total}
                    onSearch={handleSearch}
                    isFilterActive={showFilter}
                    filterAppliedCount={filterAppliedCount}
                    onClickFilter={handleClickFilter}
                    searchQuery={searchQuery}
                    onClickMobileSearch={handleShowMobileSearch}
                    onClickExportExcel={handleClickExportExcel}
                />

                <Divider/>

                <FollowUpFilterBox isCardExpanded={showFilter}
                                   onFilterChange={handleFilterChange}
                                   filterState={filterState}
                                   initialFilterState={initialFilterState}
                                   filterAppliedCount={filterAppliedCount}
                                   onFilterReset={onFilterReset}
                                   onClickHide={handleClickFilter}
                />

                {!isMobile &&
                    <FollowUpTable followups={followups} loading={loading}
                                   onViewClick={handleViewDialogOpen} pagination={pagination}
                                   onTablePageChange={handlePageChange}/>
                }

                {isMobile &&
                    <MobileFollowUpTable followups={followups} loading={loading} onClickEdit={handleOnClickEdit}
                                         onViewClick={handleViewDialogOpen} pagination={pagination}
                                         onTablePageChange={handlePageChange}/>
                }
                {isDialogOpen &&
                    <FollowUpFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                        initialData={editData} onSuccess={handleSuccess}
                                        initialFilterState={initialFilterState}/>
                }
                {isViewDialogOpen &&
                    <FollowUpViewDialog isDialogOpen={isViewDialogOpen} id={viewId} onClickEdit={handleOnClickEdit}
                                        handleDialogClose={handleViewDialogClose}/>
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
export default FollowupCommonPage;