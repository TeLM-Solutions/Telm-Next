import DefaultLayout from "../../../components/layouts/DefaultLayout";
import {Box, Divider, Paper, Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import DataManagementTabs from "@/components/common/admin/DataManagementTabs";
import FollowUpReasonsHeader from "@/components/reasons/FollowUpReasonHeader";
import {deleteReason, fetchReasons} from "@/store/slices/reasonsSlice";
import FollowUpReasonTable from "@/components/reasons/FollowUpReasonTable";
import FollowUpReasonFormDialog from "@/components/reasons/FollowUpReasonFormDaialog";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const FollowupReasons = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const {loading, reasons} = useSelector((state) => state.reasons);

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
        dispatch(fetchReasons());
    }, [dispatch]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (id) => {
        const toEdit = reasons.find((reason) => reason.id === id);

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
            setSnackMessage('Follow Up reason updated successfully')
        } else {
            setSnackMessage('Follow Up reason created successfully')
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
        await dispatch(deleteReason(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Follow Up reason deleted successfully')
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
                        <FollowUpReasonsHeader reasons={reasons} onClickAdd={handleDialogOpen}/>
                        <Divider/>
                        <FollowUpReasonTable loading={loading} reasons={reasons} onClickEdit={handleOnClickEdit}
                                             onClickDelete={handleOpenDeleteDialog}/>
                    </Paper>
                </Stack>

            </Box>
            {isDialogOpen &&
                <FollowUpReasonFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                          initialData={editData} onSuccess={handleSuccess}/>
            }

            {showDeleteDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseDeleteDialog}
                    isDialogOpen={showDeleteDialog}
                    handleDelete={handleDelete}
                    message={"Are you sure want to delete this reason?"}
                    title={"Delete Follow Up Reason"}
                    isDeleting={isDeleting}
                />
            }
            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>
        </DefaultLayout>
    )
}
export default FollowupReasons;