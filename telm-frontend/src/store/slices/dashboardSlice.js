// DashboardSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    dashboard: [],
    loading: false,
    error: null,
};

export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async () => {
    try {
        const response = await axios.get('/api/dashboard'); // Adjust the API endpoint
        return response.data.dashboard;
    } catch (error) {
        throw error;
    }
});

export const changePassword = createAsyncThunk(
    'user/changePassword', async (data, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/change_password', data);
            return response.data;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error (email already exists)
                return rejectWithValue(error.response.data);
            } else {
                throw error; // Re-throw other errors
            }
        }
    });


const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
                state.error = null;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
    },
});

export default DashboardSlice.reducer;
export const {resetFollowUpState} = DashboardSlice.actions;