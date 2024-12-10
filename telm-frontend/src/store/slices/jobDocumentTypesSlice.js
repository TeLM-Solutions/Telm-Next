// job_document_typeSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '@/lib/axios';

// Initial state
const initialState = {
    job_document_types: [],
    job_document_type: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

// Thunk for fetching all job_document_types
export const fetchJobDocumentTypes = createAsyncThunk('job_document_types/fetchJobDocumentTypes', async () => {
    const response = await axios.get('/api/job_document_types');
    return response.data;
});

// Thunk for creating a job_document_type
export const createJobDocumentType = createAsyncThunk('job_document_types/createJobDocumentType', async (job_document_typeData) => {
    const response = await axios.post('/api/job_document_types', job_document_typeData);
    return response.data;
});

// Thunk for updating a job_document_type
export const updateJobDocumentType = createAsyncThunk('job_document_types/updateJobDocumentType', async (job_document_typeData) => {
    const {id, data} = job_document_typeData;
    const response = await axios.put(`/api/job_document_types/${id}`, data);
    return response.data;
});

// Thunk for deleting a job_document_type
export const deleteJobDocumentType = createAsyncThunk('job_document_types/deleteJobDocumentType', async (job_document_typeId) => {
    await axios.delete(`/api/job_document_types/${job_document_typeId}`);
    return job_document_typeId;
});

// Create the job_document_type slice
const jobDocumentTypesSlice = createSlice({
    name: 'job_document_types',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobDocumentTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobDocumentTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.job_document_types = action.payload;
            })
            .addCase(fetchJobDocumentTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createJobDocumentType.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createJobDocumentType.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createJobDocumentType.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateJobDocumentType.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateJobDocumentType.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedJobDocumentType = action.payload;
                const index = state.job_document_types.findIndex((s) => s.id === updatedJobDocumentType.id);
                if (index !== -1) {
                    state.job_document_types[index] = updatedJobDocumentType;
                }
            })
            .addCase(updateJobDocumentType.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteJobDocumentType.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteJobDocumentType.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.job_document_types = state.job_document_types.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteJobDocumentType.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            });
    },
});

export default jobDocumentTypesSlice.reducer;

// Export actions for use in components
export const {clearError} = jobDocumentTypesSlice.actions;