import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import BranchHeader from "../../components/branches/BranchHeader";
import BranchTable from "../../components/branches/BranchTable";
import {useDispatch, useSelector} from '@/store';
import {deleteBranch, fetchBranches} from "@/store/slices/branchesSlice";
import {useCallback, useEffect, useState} from "react";
import BranchFormDialog from "@/components/branches/BranchFormDialog";
import BranchViewDialog from "@/components/branches/BranchViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteDialog from "@/components/common/DeleteDialog";
import Snack from "@/components/common/Snack";
import MobileSearch from "@/components/common/MobileSearch";

const Branches = () => {
    const dispatch = useDispatch();
    const {loading, branches, pagination} = useSelector((state) => state.branches);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editBranchData, setEditBranchData] = useState(null); // Store the branch data for editing
    // view
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewId, setViewId] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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


    // search and pagination
    useEffect(() => {
        dispatch(fetchBranches({
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


    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditBranchData(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditBranchData(null);
    };

    const handleOnClickEdit = (branchId) => {
        const branchToEdit = branches.find((branch) => branch.id === branchId);

        if (branchToEdit) {
            setEditBranchData(branchToEdit);
            setDialogOpen(true);
        }
    }

    // view
    const handleViewDialogOpen = (id) => {
        setViewId(id)
        setIsViewDialogOpen(true);
    }
    const handleViewDialogClose = () => {
        setViewId(null)
        setIsViewDialogOpen(false);
    }

    // show snack
    const handleSuccess = (isUpdate = false) => {
        console.log('reached here')
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Branch updated successfully')
        } else {
            setSnackMessage('Branch created successfully')
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
        await dispatch(deleteBranch(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Branch deleted successfully')
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
                <BranchHeader branches={branches} onClickAdd={handleDialogOpen} onSearch={handleSearch}
                              total={pagination?.total}
                              isLoading={loading}
                              searchQuery={searchQuery}
                              onClickMobileSearch={handleShowMobileSearch}
                />
                <Divider/>
                <BranchTable loading={loading} branches={branches} onClickEdit={handleOnClickEdit}
                             onClickView={handleViewDialogOpen} pagination={pagination}
                             onTablePageChange={handlePageChange} onClickDelete={handleOpenDeleteDialog}/>
                {isDialogOpen &&
                    <BranchFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                      initialData={editBranchData} onSuccess={handleSuccess}/>
                }
                {isViewDialogOpen &&
                    <BranchViewDialog isDialogOpen={isViewDialogOpen} handleDialogClose={handleViewDialogClose}
                                      id={viewId}/>
                }

                {showDeleteDialog &&
                    <DeleteDialog
                        handleDialogClose={handleCloseDeleteDialog}
                        isDialogOpen={showDeleteDialog}
                        handleDelete={handleDelete}
                        message={"Are you sure want to delete this branch?"}
                        title={"Delete Branch"}
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
export default Branches;