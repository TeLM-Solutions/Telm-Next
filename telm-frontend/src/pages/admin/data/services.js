import DefaultLayout from "../../../components/layouts/DefaultLayout";
import {Box, Divider, Paper, Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import {deleteService, fetchServices} from "@/store/slices/serviceSlice";
import ServiceHeader from "@/components/services/ServiceHeader";
import ServiceTable from "@/components/services/ServiceTable";
import ServiceFormDialog from "@/components/services/ServiceFormDialog";
import DataManagementTabs from "@/components/common/admin/DataManagementTabs";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Services = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const {loading, services} = useSelector((state) => state.services);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // delete
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    // snackbar
    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (id) => {
        const toEdit = services.find((service) => service.id === id);

        if (toEdit) {
            setEditData(toEdit);
            setDialogOpen(true);
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditData(null);
    };

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
        await dispatch(deleteService(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Service deleted successfully')
    }

    // show snackbar on success
    const handleSuccess = (isUpdate = false) => {
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Service updated successfully')
        } else {
            setSnackMessage('Service created successfully')
        }
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
                        <ServiceHeader services={services} onClickAdd={handleDialogOpen}/>
                        <Divider/>
                        <ServiceTable loading={loading} services={services} onClickEdit={handleOnClickEdit}
                                      onClickDelete={handleOpenDeleteDialog}/>
                    </Paper>
                </Stack>
            </Box>
            {isDialogOpen &&
                <ServiceFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                   initialData={editData} onSuccess={handleSuccess}/>
            }

            {showDeleteDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseDeleteDialog}
                    isDialogOpen={showDeleteDialog}
                    handleDelete={handleDelete}
                    message={"Are you sure want to delete this service?"}
                    title={"Delete Service"}
                    isDeleting={isDeleting}
                />
            }

            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>

        </DefaultLayout>
    )
}
export default Services;