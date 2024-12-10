import DefaultLayout from "../../../components/layouts/DefaultLayout";
import {Box, Divider, Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect, useState} from "react";
import {deleteLocation, deleteRoute, fetchRoutes, fetchRoutesSilent} from "@/store/slices/routesSlice";
import RouteHeader from "@/components/routes/RouteHeader";
import RouteTable from "@/components/routes/RouteTable";
import RouteFormDialog from "@/components/routes/RouteFormDialog";
import Paper from "@mui/material/Paper";
import DataManagementTabs from "@/components/common/admin/DataManagementTabs";
import RouteLocationFormDialog from "@/components/routes/dialog/RouteLocationFormDialog";
import LocationFormDialog from "@/components/routes/LocationFormDialog";
import Snack from "@/components/common/Snack";
import DeleteDialog from "@/components/common/DeleteDialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Routes = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const {loading, routes} = useSelector((state) => state.routes);

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // location
    const [isLocationDialogOpen, setLocationDialogOpen] = useState(false);
    const [editLocationData, setEditLocationData] = useState(null);

    const [isAddLocationDialogOpen, setAddLocationDialogOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);

    // snackbar
    const [showSnack, setShowSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // delete
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    // location delete
    const [showDeleteLocationDialog, setShowDeleteLocationDialog] = useState(false);
    const [deleteLocationID, setDeleteLocationID] = useState(null);
    const [isLocationDeleting, setIsLocationDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchRoutes());
    }, [dispatch]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setEditData(null);
    };

    const handleOnClickEdit = (routesId) => {
        const toEdit = routes.find((route) => route.id === routesId);

        if (toEdit) {
            setEditData(toEdit);
            setDialogOpen(true);
        }
    }
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditData(null);
    };

    // location add
    const handleLocationAddDialogOpen = (route) => {
        setAddLocationDialogOpen(true);
        setSelectedRoute(route);
    };
    const handleLocationAddDialogClose = () => {
        setAddLocationDialogOpen(false);
        setSelectedRoute(null);
    };

    // location edit
    const handleOnClickLocationEdit = (routeId, locationId) => {
        const foundRoute = routes.find(route => route.id === routeId);
        const foundLocation = foundRoute.locations.find(location => location.id === locationId);
        if (foundLocation) {
            setEditLocationData(foundLocation)
            setLocationDialogOpen(true)
        }
    }
    const handleLocationEditClose = () => {
        setLocationDialogOpen(false)
        setEditLocationData(null)
    }

    // show snackbar on success
    const handleLocationEditSuccess = () => {
        setShowSnack(true)
        setSnackMessage('Location updated successfully')
    }
    const handleLocationsAddSuccess = () => {
        setShowSnack(true)
        setSnackMessage('Locations added successfully')
    }

    const handleSuccess = (isUpdate = false) => {
        setShowSnack(true)
        if (isUpdate) {
            setSnackMessage('Route updated successfully')
        } else {
            setSnackMessage('Route created successfully')
        }
    }

    // delete route
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
        await dispatch(deleteRoute(deleteID))
        setShowDeleteDialog(false);
        setDeleteID(null)
        setIsDeleting(false);
        setShowSnack(true)
        setSnackMessage('Route deleted successfully')
    }

    // delete location
    const handleOpenLocationDeleteDialog = (id) => {
        setDeleteLocationID(id)
        setShowDeleteLocationDialog(true)
    }
    const handleCloseLocationDeleteDialog = () => {
        setDeleteLocationID(null)
        setShowDeleteLocationDialog(false)
    }
    const handleLocationDelete = async () => {
        setIsLocationDeleting(true);
        await dispatch(deleteLocation(deleteLocationID))
        await dispatch(fetchRoutesSilent());
        setShowDeleteLocationDialog(false);
        setDeleteLocationID(null)
        setIsLocationDeleting(false);
        setShowSnack(true)
        setSnackMessage('Location deleted successfully')
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
                        <RouteHeader routes={routes} onClickAdd={handleDialogOpen}/>
                        <Divider/>

                        <RouteTable loading={loading} routes={routes} onClickEdit={handleOnClickEdit}
                                    onClickAddLocations={handleLocationAddDialogOpen}
                                    onClickEditLocation={handleOnClickLocationEdit}
                                    onClickDelete={handleOpenDeleteDialog}
                                    onClickDeleteLocation={handleOpenLocationDeleteDialog}/>
                    </Paper>
                </Stack>
            </Box>
            {isDialogOpen &&
                <RouteFormDialog isDialogOpen={isDialogOpen} handleDialogClose={handleDialogClose}
                                 initialData={editData} onSuccess={handleSuccess}/>
            }
            {isAddLocationDialogOpen &&
                <RouteLocationFormDialog isDialogOpen={isAddLocationDialogOpen}
                                         handleDialogClose={handleLocationAddDialogClose} route={selectedRoute}
                                         onSuccess={handleLocationsAddSuccess}/>
            }
            {isLocationDialogOpen &&
                <LocationFormDialog isDialogOpen={isLocationDialogOpen} handleDialogClose={handleLocationEditClose}
                                    initialData={editLocationData} onSuccess={handleLocationEditSuccess}/>
            }

            {showDeleteDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseDeleteDialog}
                    isDialogOpen={showDeleteDialog}
                    handleDelete={handleDelete}
                    message={"Are you sure want to delete this route?"}
                    title={"Delete Route"}
                    isDeleting={isDeleting}
                />
            }
            {showDeleteLocationDialog &&
                <DeleteDialog
                    handleDialogClose={handleCloseLocationDeleteDialog}
                    isDialogOpen={showDeleteLocationDialog}
                    handleDelete={handleLocationDelete}
                    message={"Are you sure want to delete this location?"}
                    title={"Delete Location"}
                    isDeleting={isLocationDeleting}
                />
            }

            <Snack showSnack={showSnack} snackMessage={snackMessage} onClose={() => setShowSnack(false)}/>

        </DefaultLayout>
    )
}
export default Routes;