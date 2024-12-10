// ReportSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    reports: [],
    loading: false,
    error: null,
};

export const fetchLeadJobReports = createAsyncThunk('reports/lead_job_reports', async (data = null) => {
    try {
        let reportUrl = '/api/reports/lead_job_reports';
        if (data) {
            reportUrl = `${reportUrl}?branch=${data.branch}`
        } else {
            reportUrl = `${reportUrl}?branch=all`
        }
        const response = await axios.get(reportUrl); // Adjust the API endpoint
        return response.data.report;
    } catch (error) {
        throw error;
    }
});

const ReportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeadJobReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeadJobReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
                state.error = null;
            })
            .addCase(fetchLeadJobReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
    },
});

export default ReportSlice.reducer;