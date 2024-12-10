// branchManagersSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    managers: [],
    manager: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    pagination: null
};

export const fetchManagers = createAsyncThunk('managers/fetchManagers', async (query = null) => {
    try {
        let apiURL = '/api/managers';
        if (query) {
            apiURL = `${apiURL}?q=${query.q}&page=${query.p}`
        }
        const response = await axios.get(apiURL);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchAllManagers = createAsyncThunk('managers/fetchAllManagers', async (query = null) => {
    try {
        const response = await axios.get('/api/managers/all', {
            params: query
        });
        return response.data.managers;
    } catch (error) {
        throw error;
    }
});

export const fetchAManager = createAsyncThunk('managers/fetchAManager', async (id) => {
    try {
        const response = await axios.get(`/api/managers/${id}`);
        return response.data.manager;
    } catch (error) {
        throw error;
    }
});

// Create async thunks for creating, updating, and deleting managers
export const createManager = createAsyncThunk(
    'managers/createManager', async (managerData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/managers', managerData);
            return response.data.manager;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error (email already exists)
                return rejectWithValue(error.response.data.errors);
            } else {
                throw error; // Re-throw other errors
            }
        }
    });

export const updateManager = createAsyncThunk('managers/updateManager', async (managerData, {rejectWithValue}) => {
    const {id, data} = managerData;
    try {
        const response = await axios.put(`/api/managers/${id}`, data);
        return response.data.manager;
    } catch (error) {
        if (error.response.status === 422) {
            console.log(error)
            // Handle the specific case of a validation error (email already exists)
            return rejectWithValue(error.response.data.errors);
        } else {
            throw error; // Re-throw other errors
        }
    }
});

export const deleteManager = createAsyncThunk('managers/deleteManager', async (managerId) => {
    try {
        await axios.delete(`/api/managers/${managerId}`);
        return managerId;
    } catch (error) {
        throw error;
    }
});

const branchManagersSlice = createSlice({
    name: 'branchManagers',
    initialState,
    reducers: {
        resetManagerState: (state) => {
            state.manager = null;
        },
        resetManagersState: (state) => {
            state.managers = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.loading = false;
                state.managers = action.payload.managers;
                state.pagination = action.payload.pagination
                state.error = null;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
            .addCase(fetchAllManagers.fulfilled, (state, action) => {
                state.loading = false;
                state.managers = action.payload;
                state.error = null;
            })
            .addCase(fetchAManager.fulfilled, (state, action) => {
                state.manager = action.payload;
            })
            .addCase(createManager.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createManager.fulfilled, (state, action) => {
                state.isCreating = false;
                state.error = null;
            })
            .addCase(createManager.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message || 'An error occurred while creating a manager.';
            })
            .addCase(updateManager.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateManager.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedManagerIndex = state.managers.findIndex((manager) => manager.id === action.payload.id);
                if (updatedManagerIndex !== -1) {
                    state.managers[updatedManagerIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateManager.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message || 'An error occurred while updating a manager.';
            })
            .addCase(deleteManager.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.managers = state.managers.filter((manager) => manager.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteManager.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message || 'An error occurred while deleting a manager.';
            });
    },
});

export default branchManagersSlice.reducer;

export const {resetManagerState, resetManagersState} = branchManagersSlice.actions;