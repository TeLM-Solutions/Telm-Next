// followupSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    followups: [],
    followup: null,
    filters: [],
    pagination: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

export const fetchFollowUps = createAsyncThunk('followups/fetchFollowUps', async (query) => {
    try {
        let apiURL = '/api/followups';
        const response = await axios.get(apiURL, {
            params: query,
        }); // Adjust the API endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchAFollowUp = createAsyncThunk('followups/fetchAFollowUp', async (id) => {
    try {
        const response = await axios.get(`/api/followups/${id}`); // Adjust the API endpoint
        return response.data.followup;
    } catch (error) {
        throw error;
    }
});

// Create async thunks for creating, updating, and deleting followups
export const createFollowUp = createAsyncThunk(
    'followups/createFollowUp', async (followupData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/followups', followupData);
            return response.data.followup;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error (email already exists)
                return rejectWithValue(error.response.data.errors);
            } else {
                throw error; // Re-throw other errors
            }
        }
    });

export const updateFollowUp = createAsyncThunk('followups/updateFollowUp', async (followupData, {rejectWithValue}) => {
    const {id, formData} = followupData;
    console.log(followupData)
    try {
        const response = await axios.put(`/api/followups/${id}`, formData); // Adjust the API endpoint
        return response.data.followup;
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

export const deleteFollowUp = createAsyncThunk('followups/deleteFollowUp', async (followupId) => {
    try {
        await axios.delete(`/api/followups/${followupId}`); // Adjust the API endpoint
        return followupId;
    } catch (error) {
        throw error;
    }
});


export const changeStatusFollowUp = createAsyncThunk('followups/changeStatusFollowUp', async (data) => {
    try {
        await axios.post(`/api/followups/${data.id}/update`, {status: data.status}); // Adjust the API endpoint
        return followupId;
    } catch (error) {
        throw error;
    }
});

export const checkDateAndTime = createAsyncThunk('followups/changeStatusFollowUp', async (data) => {
    try {
        const response = await axios.post(`/api/followups/check/date-time`, {date: data.date, time: data.time});
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchFollowupFilters = createAsyncThunk('leads/fetchFollowupFilters', async (id) => {
    try {
        const response = await axios.get(`/api/followups/filters`); // Adjust the API endpoint
        return response.data.filters;
    } catch (error) {
        throw error;
    }
});

const followupSlice = createSlice({
    name: 'followups',
    initialState,
    reducers: {
        resetFollowUpState: (state) => {
            state.followup = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowUps.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFollowUps.fulfilled, (state, action) => {
                state.loading = false;
                state.followups = action.payload.followups;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchFollowUps.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
            .addCase(fetchAFollowUp.fulfilled, (state, action) => {
                state.followup = action.payload;
            })
            .addCase(createFollowUp.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createFollowUp.fulfilled, (state, action) => {
                state.isCreating = false;
                state.error = null;
            })
            .addCase(createFollowUp.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message || 'An error occurred while creating a followup.';
            })
            .addCase(updateFollowUp.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(fetchFollowupFilters.fulfilled, (state, action) => {
                state.filters = action.payload;
            })
            .addCase(updateFollowUp.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedFollowUpIndex = state.followups.findIndex((followup) => followup.id === action.payload.id);
                if (updatedFollowUpIndex !== -1) {
                    state.followups[updatedFollowUpIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateFollowUp.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message || 'An error occurred while updating a followup.';
            })
            .addCase(deleteFollowUp.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteFollowUp.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.followups = state.followups.filter((followup) => followup.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteFollowUp.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message || 'An error occurred while deleting a followup.';
            });
    },
});

export default followupSlice.reducer;
export const {resetFollowUpState} = followupSlice.actions;