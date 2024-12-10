import DefaultLayout from "@/components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import {useAuth} from "@/hooks/auth";
import {useDispatch, useSelector} from "@/store";
import {useCallback, useEffect, useState} from "react";
import {changeStatus, deleteLead, exportToExcel, fetchLeads} from "@/store/slices/leadSlice";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadTable from "@/components/leads/LeadTable";
import LeadViewDialog from "@/components/leads/LeadViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileLeadTable from "@/components/leads/mobile/MobileLeadTable";
import countChangedValues from "@/lib/countFilterChanges";
import LeadFilterBox from "@/components/leads/filter/LeadFilterBox";
import MobileSearch from "@/components/common/MobileSearch";
import LeadFormDialog from "@/components/leads/LeadFormDialog";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import {subscribe, unsubscribe} from "@/lib/events";

const LeadsCommonPage = ({initialFilterState}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {user} = useAuth({middleware: 'auth'})

    const dispatch = useDispatch();
    const {loading, leads, pagination} = useSelector((state) => state.leads);

    // add edit
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // filter
    const [showFilter, setShowFilter] = useState(false);
    const [filterAppliedCount, setFilterAppliedCount] = useState(0);
    const [filterState, setFilterState] = useState(initialFilterState);

    //search
    const [searchQuery, setSearchQuery] = useState('');
    // paging
    const [currentPage, setCurrentPage] = useState(0);

    // view
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewId, setViewId] = useState(null);

    // mobile search
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // toast
    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // delete
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    const [viewActiveTab, setViewActiveTab] = useState(0)

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

    const handleViewDialogOpen = (id) => {
        setViewId(id)
        setIsViewDialogOpen(true);
    }
    const handleViewDialogClose = () => {
        setViewId(null)
        setIsViewDialogOpen(false);
        setViewActiveTab(0)
    }

    // add edit
    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (leadId) => {
        const toEdit = leads.find((lead) => lead.id === leadId);

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
            setSnackMessage('Lead updated successfully')
        } else {
            setSnackMessage('Lead created successfully')
        }
    }

    // mobile search
    const handleShowMobileSearch = () => {
        setShowMobileSearch(true)
    }
    const handleHideMobileSearch = () => {
        setShowMobileSearch(false)
    }

    // delete
    const handleOpenDeleteDialog = (id) => {
        setDeleteID(id)
        setShowDeleteDialog(true)
    }
    const handleCloseDeleteDialog = () => {
        setDeleteID(null)
        setShowDeleteDialog(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        await dispatch(deleteLead(deleteID));
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Lead deleted successfully')
    }

    const handleHoldLead = async (id, type) => {
        setShowSnack(false)
        await dispatch(changeStatus({leadId: id, type: type}));
        await dispatch(fetchLeads({
            q: searchQuery,
            page: currentPage + 1,
            ...filterState
        }));
        setShowSnack(true)
        setSnackMessage(`Lead status changed to ${type.toUpperCase()}`)
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

    const handleAssignJobClick = (id) => {
        setViewId(id);
        setViewActiveTab(2)
        setIsViewDialogOpen(true);
    }
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

                <LeadHeader
                    leads={leads}
                    onSearch={handleSearch}
                    isLoading={loading}
                    onClickFilter={handleClickFilter}
                    isFilterActive={showFilter}
                    filterAppliedCount={filterAppliedCount}
                    total={pagination?.total}
                    searchQuery={searchQuery}
                    onClickMobileSearch={handleShowMobileSearch}
                    onClickAdd={handleDialogOpen}
                    onClickExportExcel={handleClickExportExcel}
                />
                <Divider/>
                <LeadFilterBox isCardExpanded={showFilter} onFilterChange={handleFilterChange}
                               filterState={filterState} initialFilterState={initialFilterState}
                               filterAppliedCount={filterAppliedCount} onFilterReset={onFilterReset}
                               onClickHide={handleClickFilter}/>

                {isMobile &&
                    <MobileLeadTable onClickEdit={handleOnClickEdit}
                                     loading={loading}
                                     leads={leads}
                                     user={user}
                                     onClickView={handleViewDialogOpen}
                                     pagination={pagination}
                                     onTablePageChange={handlePageChange}
                                     onClickDelete={handleOpenDeleteDialog}
                                     onClickHold={handleHoldLead}
                    />
                }
                {!isMobile &&
                    <LeadTable loading={loading}
                               leads={leads}
                               user={user}
                               onClickView={handleViewDialogOpen}
                               pagination={pagination}
                               onClickEdit={handleOnClickEdit}
                               onTablePageChange={handlePageChange}
                               onClickDelete={handleOpenDeleteDialog}
                               onClickHold={handleHoldLead}
                               onClickAssignClick={handleAssignJobClick}

                    />
                }
                {isViewDialogOpen &&
                    <LeadViewDialog isDialogOpen={isViewDialogOpen} handleDialogClose={handleViewDialogClose}
                                    id={viewId} activeTab={viewActiveTab}/>
                }

                {isMobile &&
                    <MobileSearch onClose={handleHideMobileSearch} isOpen={showMobileSearch} onSearch={handleSearch}
                                  searchQuery={searchQuery}/>
                }

                {isDialogOpen &&
                    <LeadFormDialog isDialogOpen={isDialogOpen}
                                    handleDialogClose={handleDialogClose}
                                    onSuccess={handleSuccess}
                                    initialData={editData} initialFilterState={initialFilterState}/>
                }

                {showDeleteDialog &&
                    <DeleteDialog
                        handleDialogClose={handleCloseDeleteDialog}
                        isDialogOpen={showDeleteDialog}
                        handleDelete={handleDelete}
                        message={"Are you sure want to delete this lead?"}
                        title={"Delete Lead"}
                        isDeleting={isDeleting}
                    />
                }
                <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>
            </Card>
        </DefaultLayout>
    )
}
export default LeadsCommonPage;