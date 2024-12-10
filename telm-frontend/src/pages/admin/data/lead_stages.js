import DefaultLayout from "../../../components/layouts/DefaultLayout";
import {Box, Divider, Paper, Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import DataManagementTabs from "@/components/common/admin/DataManagementTabs";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import LeadStagesHeader from "@/components/lead_stages/LeadStagesHeader";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {deleteLeadStage, fetchLeadStages} from "@/store/slices/leadStagesSlice";
import LeadStageTable from "@/components/lead_stages/LeadStageTable";
import LeadStageFormDialog from "@/components/lead_stages/LeadStageFormDialog";

const LeadStages = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const {loading, lead_stages} = useSelector((state) => state.leadStages);

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
        dispatch(fetchLeadStages());
    }, [dispatch]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (id) => {
        const toEdit = lead_stages.find((stage) => stage.id === id);

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
            setSnackMessage('Lead Stage updated successfully')
        } else {
            setSnackMessage('Lead Stage Type created successfully')
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
        await dispatch(deleteLeadStage(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Lead Stage deleted successfully')
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
                        <LeadStagesHeader lead_stages={lead_stages}
                                          onClickAdd={handleDialogOpen}/>
                        <Divider/>
                        <LeadStageTable loading={loading} lead_stages={lead_stages}
                                        onClickEdit={handleOnClickEdit}
                                        onClickDelete={handleOpenDeleteDialog}/>
                    </Paper>

                </Stack>

            </Box>

            {isDialogOpen &&
                <LeadStageFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                     initialData={editData} onSuccess={handleSuccess}/>
            }

            {showDeleteDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseDeleteDialog}
                    isDialogOpen={showDeleteDialog}
                    handleDelete={handleDelete}
                    message={"Are you sure want to delete this lead stage?"}
                    title={"Delete Lead Stage"}
                    isDeleting={isDeleting}
                />
            }
            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>
        </DefaultLayout>
    )
}
export default LeadStages;