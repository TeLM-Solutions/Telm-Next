import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '@/lib/axios';

const initialState = {
    routes: [],
    route: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isCreatingLocations: false,
    error: null,
};

export const fetchRoutes = createAsyncThunk('routes/fetchRoutes', async () => {
    try {
        const response = await axios.get('/api/routes'); // Adjust the API endpoint
        return response.data.routes;
    } catch (error) {
        throw error;
    }
});

export const fetchRoutesSilent = createAsyncThunk('routes/fetchRoutesSilent', async () => {
    try {
        const response = await axios.get('/api/routes'); // Adjust the API endpoint
        return response.data.routes;
    } catch (error) {
        throw error;
    }
});

export const createRoute = createAsyncThunk('routes/createRoute', async (routeData) => {
    try {
        const response = await axios.post('/api/routes', routeData); // Adjust the API endpoint
        return response.data.route;
    } catch (error) {
        throw error;
    }
});

export const createRouteLocations = createAsyncThunk('routes/createRouteLocations', async (routeData) => {
    try {
        const response = await axios.post(`/api/routes/${routeData.id}/locations`, routeData); // Adjust the API endpoint
        return response.data.locations;
    } catch (error) {
        throw error;
    }
});

export const updateRoute = createAsyncThunk('routes/updateRoute', async (data) => {
    const {id, routeData} = data;
    try {
        const response = await axios.put(`/api/routes/${id}`, routeData); // Adjust the API endpoint
        return response.data.route;
    } catch (error) {
        throw error;
    }
});

export const updateLocation = createAsyncThunk('routes/updateLocation', async (data) => {
    const {routeId, locationId, locationData} = data;
    try {
        const response = await axios.put(`/api/routes/${routeId}/locations/${locationId}`, locationData); // Adjust the API endpoint
        return response.data.route;
    } catch (error) {
        throw error;
    }
});

export const deleteRoute = createAsyncThunk('routes/deleteRoute', async (id) => {
    try {
        await axios.delete(`/api/routes/${id}`); // Adjust the API endpoint
        return id;
    } catch (error) {
        throw error;
    }
});

export const deleteLocation = createAsyncThunk('routes/deleteLocation', async (id) => {
    try {
        await axios.delete(`/api/routes/locations/${id}`); // Adjust the API endpoint
        return id;
    } catch (error) {
        throw error;
    }
});

const routesSlice = createSlice({
    name: 'routes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoutes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRoutes.fulfilled, (state, action) => {
                state.loading = false;
                state.routes = action.payload;
            })
            .addCase(fetchRoutesSilent.fulfilled, (state, action) => {
                state.routes = action.payload;
            })
            .addCase(fetchRoutes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createRoute.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createRoute.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createRoute.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateRoute.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateRoute.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedIndex = state.routes.findIndex((route) => route.id === action.payload.id);
                console.log(updatedIndex)
                if (updatedIndex !== -1) {
                    state.routes[updatedIndex] = action.payload;
                }
            })
            .addCase(updateRoute.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteRoute.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteRoute.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.routes = state.routes.filter((route) => route.id !== action.payload);
            })
            .addCase(deleteRoute.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            })
            .addCase(createRouteLocations.pending, (state) => {
                state.isCreatingLocations = true;
            })
            .addCase(createRouteLocations.fulfilled, (state, action) => {
                state.isCreatingLocations = false;
            });
    },
});

export default routesSlice.reducer;