// lead_sourceslice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '../../lib/axios';

// Initial state
const initialState = {
    lead_sources: [],
    lead_source: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

// Thunk for fetching all lead_sources
export const fetchLeadSources = createAsyncThunk('lead_sources/fetchLeadSources', async () => {
    const response = await axios.get('/api/lead_sources');
    return response.data;
});

// Thunk for creating a lead_source
export const createLeadSource = createAsyncThunk('lead_sources/createLeadSource', async (lead_sourceData) => {
    const response = await axios.post('/api/lead_sources', lead_sourceData);
    return response.data;
});

// Thunk for updating a lead_source
export const updateLeadSource = createAsyncThunk('lead_sources/updateLeadSource', async (lead_sourceData) => {
    const {id, data} = lead_sourceData;
    const response = await axios.put(`/api/lead_sources/${id}`, data);
    return response.data;
});

// Thunk for deleting a lead_source
export const deleteLeadSource = createAsyncThunk('lead_sources/deleteLeadSource', async (lead_sourceId) => {
    await axios.delete(`/api/lead_sources/${lead_sourceId}`);
    return lead_sourceId;
});

// Create the lead_source slice
const LeadSourcesSlice = createSlice({
    name: 'lead_sources',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeadSources.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeadSources.fulfilled, (state, action) => {
                state.loading = false;
                state.lead_sources = action.payload;
            })
            .addCase(fetchLeadSources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createLeadSource.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createLeadSource.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createLeadSource.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateLeadSource.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateLeadSource.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedLeadSource = action.payload;
                const index = state.lead_sources.findIndex((s) => s.id === updatedLeadSource.id);
                if (index !== -1) {
                    state.lead_sources[index] = updatedLeadSource;
                }
            })
            .addCase(updateLeadSource.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteLeadSource.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteLeadSource.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.lead_sources = state.lead_sources.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteLeadSource.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            });
    },
});

export default LeadSourcesSlice.reducer;

// Export actions for use in components
export const {clearError} = LeadSourcesSlice.actions;