import DefaultLayout from "../../../components/layouts/DefaultLayout";
import {Box, Divider, Paper, Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import DataManagementTabs from "@/components/common/admin/DataManagementTabs";
import {deleteJobDocumentType, fetchJobDocumentTypes} from "@/store/slices/jobDocumentTypesSlice";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import JobDocumentTypesHeader from "@/components/job_document_types/JobDocumentTypesHeader";
import JobDocumentTypeTable from "@/components/job_document_types/JobDocumentTypeTable";
import JobDocumentTypesFormDialog from "@/components/job_document_types/JobDocumentTypesFormDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const JobDocumentTypes = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const {loading, job_document_types} = useSelector((state) => state.jobDocumentTypes);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // snackbar
    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // delete
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    useEffect(() => {
        dispatch(fetchJobDocumentTypes());
    }, [dispatch]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (id) => {
        const toEdit = job_document_types.find((reason) => reason.id === id);

        if (toEdit) {
            setEditData(toEdit);
            setDialogOpen(true);
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditData(null);
    };

    // show snackbar on success
    const handleSuccess = (isUpdate = false) => {
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Job Document Type updated successfully')
        } else {
            setSnackMessage('Job Document Type created successfully')
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
        await dispatch(deleteJobDocumentType(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Job Document Type deleted successfully')
    }

    return (
        <DefaultLayout padded={false}>
            {isMobile &&
                <DataManagementTabs/>
            }
            <Box sx={{
                padding: {
                    md: '2rem'
                }
            }}>
                <Stack direction={"row"} gap={"1rem"} sx={{minHeight: 'calc(100vh - 15rem)'}}>
                    {!isMobile &&
                        <DataManagementTabs/>
                    }
                    <Paper sx={{flex: 1}}>
                        <JobDocumentTypesHeader job_document_types={job_document_types}
                                                onClickAdd={handleDialogOpen}/>
                        <Divider/>
                        <JobDocumentTypeTable loading={loading} job_document_types={job_document_types}
                                              onClickEdit={handleOnClickEdit}
                                              onClickDelete={handleOpenDeleteDialog}/>
                    </Paper>
                </Stack>
            </Box>

            {isDialogOpen &&
                <JobDocumentTypesFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                            initialData={editData} onSuccess={handleSuccess}/>
            }

            {showDeleteDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseDeleteDialog}
                    isDialogOpen={showDeleteDialog}
                    handleDelete={handleDelete}
                    message={"Are you sure want to delete this document type?"}
                    title={"Delete Job Document Type"}
                    isDeleting={isDeleting}
                />
            }
            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>
        </DefaultLayout>
    )
}
export default JobDocumentTypes;