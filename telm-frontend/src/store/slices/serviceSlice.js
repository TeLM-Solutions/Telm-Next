// serviceSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '@/lib/axios';

// Initial state
const initialState = {
    services: [],
    service: null,
    allServices: [],
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

// Thunk for fetching all services
export const fetchServices = createAsyncThunk('services/fetchServices', async () => {
    const response = await axios.get('/api/services');
    return response.data;
});
export const fetchAllServices = createAsyncThunk('services/fetchAllServices', async () => {
    const response = await axios.get('/api/services/all');
    return response.data;
});

// Thunk for creating a service
export const createService = createAsyncThunk('services/createService', async (serviceData) => {
    const response = await axios.post('/api/services', serviceData);
    return response.data.service;
});

// Thunk for updating a service
export const updateService = createAsyncThunk('services/updateService', async (serviceData) => {
    const {id, data} = serviceData;
    const response = await axios.put(`/api/services/${id}`, data);
    return response.data.service;
});

// Thunk for deleting a service
export const deleteService = createAsyncThunk('services/deleteService', async (serviceId) => {
    await axios.delete(`/api/services/${serviceId}`);
    return serviceId;
});

// Create the service slice
const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload.services;
            })
            .addCase(fetchAllServices.fulfilled, (state, action) => {
                state.loading = false;
                state.allServices = action.payload.services;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createService.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createService.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateService.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedService = action.payload;
                const index = state.services.findIndex((s) => s.id === updatedService.id);
                if (index !== -1) {
                    state.services[index] = updatedService;
                }
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteService.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.services = state.services.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            });
    },
});

export default serviceSlice.reducer;

// Export actions for use in components
export const {clearError} = serviceSlice.actions;