// lead_stageSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '@/lib/axios';

// Initial state
const initialState = {
    lead_stages: [],
    lead_stage: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

// Thunk for fetching all lead_stages
export const fetchLeadStages = createAsyncThunk('lead_stages/fetchLeadStages', async () => {
    const response = await axios.get('/api/lead_stages');
    return response.data;
});

// Thunk for creating a lead_stage
export const createLeadStage = createAsyncThunk('lead_stages/createLeadStage', async (lead_stageData) => {
    const response = await axios.post('/api/lead_stages', lead_stageData);
    return response.data;
});

// Thunk for updating a lead_stage
export const updateLeadStage = createAsyncThunk('lead_stages/updateLeadStage', async (lead_stageData) => {
    const {id, data} = lead_stageData;
    const response = await axios.put(`/api/lead_stages/${id}`, data);
    return response.data;
});

// Thunk for deleting a lead_stage
export const deleteLeadStage = createAsyncThunk('lead_stages/deleteLeadStage', async (lead_stageId) => {
    await axios.delete(`/api/lead_stages/${lead_stageId}`);
    return lead_stageId;
});

// Create the lead_stage slice
const leadStagesSlice = createSlice({
    name: 'lead_stages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeadStages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeadStages.fulfilled, (state, action) => {
                state.loading = false;
                state.lead_stages = action.payload;
            })
            .addCase(fetchLeadStages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createLeadStage.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createLeadStage.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createLeadStage.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateLeadStage.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateLeadStage.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedLeadStage = action.payload;
                const index = state.lead_stages.findIndex((s) => s.id === updatedLeadStage.id);
                if (index !== -1) {
                    state.lead_stages[index] = updatedLeadStage;
                }
            })
            .addCase(updateLeadStage.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteLeadStage.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteLeadStage.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.lead_stages = state.lead_stages.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteLeadStage.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            });
    },
});

export default leadStagesSlice.reducer;

// Export actions for use in components
export const {clearError} = leadStagesSlice.actions;