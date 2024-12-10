// jobSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    jobs: [],
    job: null,
    pagination: null,
    filters: [],
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    businessData: null,
    error: null,
    documents: []
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (query = null) => {
    try {
        let apiURL = '/api/jobs';
        const response = await axios.get(apiURL, {
            params: query,
        }); // Adjust the API endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchActiveJobs = createAsyncThunk('jobs/fetchActiveJobs', async () => {
    try {
        let apiURL = '/api/jobs/all';
        const response = await axios.get(apiURL); // Adjust the API endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchAJob = createAsyncThunk('jobs/fetchAJob', async (id) => {
    try {
        const response = await axios.get(`/api/jobs/${id}`); // Adjust the API endpoint
        return response.data.job;
    } catch (error) {
        throw error;
    }
});

export const fetchJobDocuments = createAsyncThunk('jobs/fetchJobDocuments', async (id) => {
    try {
        const response = await axios.get(`/api/jobs/documents/${id}`); // Adjust the API endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
});

// Create async thunks for creating, updating, and deleting jobs
export const createJob = createAsyncThunk(
    'jobs/createJob', async (jobData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/jobs', jobData);
            return response.data.job;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error (email already exists)
                return rejectWithValue(error.response.data.errors);
            } else {
                throw error; // Re-throw other errors
            }
        }
    });

export const updateJob = createAsyncThunk('jobs/updateJob', async (jobData, {rejectWithValue}) => {
    const {id, formData} = jobData;
    try {
        const response = await axios.put(`/api/jobs/${id}`, formData); // Adjust the API endpoint
        return response.data.job;
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

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (jobId) => {
    try {
        await axios.delete(`/api/jobs/${jobId}`); // Adjust the API endpoint
        return jobId;
    } catch (error) {
        throw error;
    }
});

export const deleteJobDocument = createAsyncThunk('jobs/deleteJobDocument', async (id) => {
    try {
        await axios.delete(`/api/jobs/documents/${id}`); // Adjust the API endpoint
        return id;
    } catch (error) {
        throw error;
    }
});

export const updateJobStatus = createAsyncThunk(
    'jobs/updateJobStatus', async (jobData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/jobs/status', jobData);
            return response.data;
        } catch (error) {
            if (error.response.status === 422) {
                console.log(error)
            } else {
                throw error; // Re-throw other errors
            }
        }
    });

export const fetchJobFilters = createAsyncThunk('leads/fetchJobFilters', async (id) => {
    try {
        const response = await axios.get(`/api/jobs/filters`); // Adjust the API endpoint
        return response.data.filters;
    } catch (error) {
        throw error;
    }
});


const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        resetJobState: (state) => {
            state.job = null;
        },
        resetJobsState: (state) => {
            state.jobs = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchActiveJobs.fulfilled, (state, action) => {
                state.allJobs = action.payload.jobs;
            })
            .addCase(fetchJobFilters.fulfilled, (state, action) => {
                state.filters = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
            .addCase(fetchAJob.fulfilled, (state, action) => {
                state.job = action.payload;
            })
            .addCase(fetchJobDocuments.fulfilled, (state, action) => {
                state.documents = action.payload;
            })
            .addCase(createJob.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isCreating = false;
                state.jobs.push(action.payload);
                state.error = null;
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message || 'An error occurred while creating a job.';
            })
            .addCase(updateJob.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedJobIndex = state.jobs.findIndex((job) => job.id === action.payload.id);
                if (updatedJobIndex !== -1) {
                    state.jobs[updatedJobIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message || 'An error occurred while updating a job.';
            })
            .addCase(deleteJob.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.jobs = state.jobs.filter((job) => job.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message || 'An error occurred while deleting a job.';
            });
    },
});

export default jobSlice.reducer;
export const {resetJobState, resetJobsState} = jobSlice.actions;