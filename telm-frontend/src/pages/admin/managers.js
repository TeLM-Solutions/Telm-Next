import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import ManagerHeader from "@/components/managers/ManagerHeader";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from '@/store';
import {deleteManager, fetchManagers} from "@/store/slices/managerSlice";
import ManagerTable from "@/components/managers/ManagerTable";
import ManagerFormDialog from "@/components/managers/ManagerFormDialog";
import ManagerViewDialog from "@/components/managers/ManagerViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import MobileSearch from "@/components/common/MobileSearch";

const Managers = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const {loading, managers, pagination} = useSelector((state) => state.managers);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editManagerData, setEditManagerData] = useState(null); // Store the branch data for editing
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

    // delete
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    // mobile search
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const handleOnClickEdit = (id) => {
        const toEdit = managers.find((manager) => manager.id === id);

        if (toEdit) {
            setEditManagerData(toEdit);
            setDialogOpen(true);
        }
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditManagerData(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditManagerData(null);
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

    // search and pagination
    useEffect(() => {
        dispatch(fetchManagers({
            q: searchQuery,
            p: currentPage + 1
        }));
    }, [dispatch, searchQuery, currentPage]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setCurrentPage(0); // Reset currentPage when a new search is initiated
    }, []);

    const handlePageChange = useCallback((event, newPage) => {
        setCurrentPage(newPage);
    }, []);

    // show snackbar on success
    const handleSuccess = (isUpdate = false) => {
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Manager updated successfully')
        } else {
            setSnackMessage('Manager created successfully')
        }
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
        await dispatch(deleteManager(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Manager deleted successfully')
    }

    // mobile search
    const handleShowMobileSearch = () => {
        setShowMobileSearch(true)
    }
    const handleHideMobileSearch = () => {
        setShowMobileSearch(false)
    }

    return (
        <DefaultLayout padded={!isMobile}>
            <Card sx={{width: '100%'}}>
                <ManagerHeader managers={managers}
                               onClickAdd={handleDialogOpen}
                               onSearch={handleSearch}
                               isLoading={loading}
                               total={pagination?.total}
                               searchQuery={searchQuery}
                               onClickMobileSearch={handleShowMobileSearch}
                />
                <Divider/>
                <ManagerTable loading={loading} managers={managers} onClickEdit={handleOnClickEdit}
                              onClickView={handleViewDialogOpen} pagination={pagination}
                              onTablePageChange={handlePageChange} onClickDelete={handleOpenDeleteDialog}/>
                {isDialogOpen &&
                    <ManagerFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                       initialData={editManagerData} onSuccess={handleSuccess}/>
                }

                {isViewDialogOpen &&
                    <ManagerViewDialog isDialogOpen={isViewDialogOpen} id={viewId}
                                       handleDialogClose={handleViewDialogClose}/>
                }

                {showDeleteDialog &&
                    <DeleteDialog
                        handleDialogClose={handleCloseDeleteDialog}
                        isDialogOpen={showDeleteDialog}
                        handleDelete={handleDelete}
                        message={"Are you sure want to delete this manager?"}
                        title={"Delete Manager"}
                        isDeleting={isDeleting}
                    />
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
export default Managers;