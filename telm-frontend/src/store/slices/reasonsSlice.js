// reasonSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '@/lib/axios';

// Initial state
const initialState = {
    reasons: [],
    reason: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

// Thunk for fetching all reasons
export const fetchReasons = createAsyncThunk('reasons/fetchReasons', async () => {
    const response = await axios.get('/api/reasons');
    return response.data;
});

// Thunk for creating a reason
export const createReason = createAsyncThunk('reasons/createReason', async (reasonData) => {
    const response = await axios.post('/api/reasons', reasonData);
    return response.data;
});

// Thunk for updating a reason
export const updateReason = createAsyncThunk('reasons/updateReason', async (reasonData) => {
    const {id, data} = reasonData;
    const response = await axios.put(`/api/reasons/${id}`, data);
    return response.data;
});

// Thunk for deleting a reason
export const deleteReason = createAsyncThunk('reasons/deleteReason', async (reasonId) => {
    await axios.delete(`/api/reasons/${reasonId}`);
    return reasonId;
});

// Create the reason slice
const reasonSlice = createSlice({
    name: 'reasons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReasons.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReasons.fulfilled, (state, action) => {
                state.loading = false;
                state.reasons = action.payload;
            })
            .addCase(fetchReasons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createReason.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createReason.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createReason.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateReason.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateReason.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedReason = action.payload;
                const index = state.reasons.findIndex((s) => s.id === updatedReason.id);
                if (index !== -1) {
                    state.reasons[index] = updatedReason;
                }
            })
            .addCase(updateReason.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteReason.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteReason.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.reasons = state.reasons.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteReason.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            });
    },
});

export default reasonSlice.reducer;

// Export actions for use in components
export const {clearError} = reasonSlice.actions;