import DefaultLayout from "../../../components/layouts/DefaultLayout";
import {Box, Divider, Paper, Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import DataManagementTabs from "@/components/common/admin/DataManagementTabs";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {deleteLeadSource, fetchLeadSources} from "@/store/slices/leadSourcesSlice";
import LeadSourcesHeader from "@/components/lead_sources/LeadSourcesHeader";
import LeadSourcesTable from "@/components/lead_sources/LeadSourcesTable";
import LeadSourcesFormDialog from "@/components/lead_sources/LeadSourcesFormDialog";

const LeadStages = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const {loading, lead_sources} = useSelector((state) => state.leadSources);

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
        dispatch(fetchLeadSources());
    }, [dispatch]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (id) => {
        const toEdit = lead_sources.find((source) => source.id === id);

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
            setSnackMessage('Lead Source updated successfully')
        } else {
            setSnackMessage('Lead Source Type created successfully')
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
        await dispatch(deleteLeadSource(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Lead Source deleted successfully')
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
                        <LeadSourcesHeader lead_sources={lead_sources}
                                           onClickAdd={handleDialogOpen}/>
                        <Divider/>
                        <LeadSourcesTable loading={loading} lead_sources={lead_sources}
                                          onClickEdit={handleOnClickEdit}
                                          onClickDelete={handleOpenDeleteDialog}/>
                    </Paper>

                </Stack>

            </Box>

            {isDialogOpen &&
                <LeadSourcesFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                       initialData={editData} onSuccess={handleSuccess}/>
            }

            {showDeleteDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseDeleteDialog}
                    isDialogOpen={showDeleteDialog}
                    handleDelete={handleDelete}
                    message={"Are you sure want to delete this lead source?"}
                    title={"Delete Lead Source"}
                    isDeleting={isDeleting}
                />
            }
            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>
        </DefaultLayout>
    )
}
export default LeadStages;