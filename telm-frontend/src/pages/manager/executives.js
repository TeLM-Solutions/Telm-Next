import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Card, Divider} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useCallback, useEffect, useState} from "react";
import {deleteExecutive, fetchExecutives} from "@/store/slices/executiveSlice";
import ExecutiveHeader from "@/components/executives/ExecutiveHeader";
import ExecutiveTable from "@/components/executives/ExecutiveTable";
import ExecutiveFormDialog from "@/components/executives/ExecutiveFormDialog";
import ExecutiveViewDialog from "@/components/executives/ExecutiveViewDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileExecutiveTable from "@/components/executives/mobile/MobileExecutiveTable";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import MobileSearch from "@/components/common/MobileSearch";

const Executives = () => {

    const dispatch = useDispatch();
    const {loading, executives, pagination} = useSelector((state) => state.executives);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    // view
    const handleViewDialogOpen = (id) => {
        setViewId(id)
        setIsViewDialogOpen(true);
    }
    const handleViewDialogClose = () => {
        setViewId(null)
        setIsViewDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (executiveId) => {
        const toEdit = executives.find((executive) => executive.id === executiveId);

        if (toEdit) {
            setEditData(toEdit);
            setDialogOpen(true);
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditData(null);
    };

    // search and pagination
    useEffect(() => {
        dispatch(fetchExecutives({
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
            setSnackMessage('Executive updated successfully')
        } else {
            setSnackMessage('Executive created successfully')
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
        await dispatch(deleteExecutive(deleteID))
        setCurrentPage(0);
        await dispatch(fetchExecutives({
            q: searchQuery,
            p: 1
        }));
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Executive deleted successfully')


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
            <Card sx={{width: '100%'}} className={isMobile ? "card-mobile-items" : ""}>


                <ExecutiveHeader
                    isLoading={loading}
                    executives={executives}
                    onClickAdd={handleDialogOpen}
                    onSearch={handleSearch}
                    total={pagination?.total}
                    searchQuery={searchQuery}
                    onClickMobileSearch={handleShowMobileSearch}
                />
                {!isMobile &&
                    <>
                        <Divider/>

                        <ExecutiveTable loading={loading} executives={executives} onClickEdit={handleOnClickEdit}
                                        onClickView={handleViewDialogOpen} pagination={pagination}
                                        onTablePageChange={handlePageChange} onClickDelete={handleOpenDeleteDialog}/>
                    </>
                }
                {isMobile &&
                    <MobileExecutiveTable loading={loading} executives={executives} onClickEdit={handleOnClickEdit}
                                          onClickView={handleViewDialogOpen} pagination={pagination}
                                          onTablePageChange={handlePageChange} onClickDelete={handleOpenDeleteDialog}/>
                }

                {isDialogOpen &&
                    <ExecutiveFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                         initialData={editData} onSuccess={handleSuccess}/>
                }
                {isViewDialogOpen &&
                    <ExecutiveViewDialog isDialogOpen={isViewDialogOpen} handleDialogClose={handleViewDialogClose}
                                         id={viewId}/>
                }

                {showDeleteDialog &&
                    <DeleteDialog
                        handleDialogClose={handleCloseDeleteDialog}
                        isDialogOpen={showDeleteDialog}
                        handleDelete={handleDelete}
                        message={"Are you sure want to delete this executive?"}
                        title={"Delete Executive"}
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
export default Executives;