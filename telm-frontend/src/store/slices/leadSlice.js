// leadSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    leads: [],
    lead: null,
    allLeads: [],
    filters: [],
    pagination: null,
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    businessData: null,
    error: null,
};

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async (query = null) => {
    try {
        let apiURL = '/api/leads';
        const response = await axios.get(apiURL, {
            params: query, // Send query parameters as an object
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchAllLeads = createAsyncThunk('leads/fetchAllLeads', async (query = null) => {
    try {
        let apiURL = '/api/leads/all';
        const response = await axios.get(apiURL, {
            params: query, // Send query parameters as an object
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchALead = createAsyncThunk('leads/fetchALead', async (id) => {
    try {
        const response = await axios.get(`/api/leads/${id}`); // Adjust the API endpoint
        return response.data.lead;
    } catch (error) {
        throw error;
    }
});

// Create async thunks for creating, updating, and deleting leads
export const createLead = createAsyncThunk(
    'leads/createLead', async (leadData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/leads', leadData);
            return response.data.lead;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error (email already exists)
                return rejectWithValue(error.response.data.errors);
            } else {
                throw error; // Re-throw other errors
            }
        }
    });

export const updateLead = createAsyncThunk('leads/updateLead', async (leadData, {rejectWithValue}) => {
    const {id, data} = leadData;
    try {
        const response = await axios.put(`/api/leads/${id}`, data); // Adjust the API endpoint
        return response.data.lead;
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

export const deleteLead = createAsyncThunk('leads/deleteLead', async (leadId) => {
    try {
        await axios.delete(`/api/leads/${leadId}`); // Adjust the API endpoint
        return leadId;
    } catch (error) {
        throw error;
    }
});

export const changeStatus = createAsyncThunk('leads/holdLead', async ({leadId, type}) => {
    try {
        await axios.post(`/api/leads/change-status/${leadId}?status=${type}`);
        return leadId;
    } catch (error) {
        throw error;
    }
});

export const checkBusiness = createAsyncThunk(
    'leads/checkBusiness', async (landphone, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/business/check/${landphone}`);
            return response.data.business;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error
                return rejectWithValue(error.response.data.errors);
            } else {
                throw error; // Re-throw other errors
            }
        }
    }
);
export const updateLeadService = createAsyncThunk('leads/updateLeadService', async (leadData, {rejectWithValue}) => {
    const {id, data} = leadData;
    try {
        const response = await axios.put(`/api/leads/${id}/service`, data); // Adjust the API endpoint
        return response.data.lead;
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

export const fetchLeadFilters = createAsyncThunk('leads/fetchLeadFilters', async (id) => {
    try {
        const response = await axios.get(`/api/leads/filters`); // Adjust the API endpoint
        return response.data.filters;
    } catch (error) {
        throw error;
    }
});

// change lead stage
export const changeLeadStage = createAsyncThunk('leads/changeStage', async ({leadId, stage}) => {
    try {
        await axios.put(`/api/leads/stage/${leadId}`, {stage: stage});
        return leadId;
    } catch (error) {
        throw error;
    }
});

export const fetchLeadStageHistory = createAsyncThunk('leads/fetchLeadStageHistory', async ({leadId}) => {
    try {
        const response = await axios.get(`/api/leads-stages/${leadId}`,);
        return response.data;
    } catch (error) {
        throw error;
    }
});
export const exportToExcel = createAsyncThunk('leads/exportToExcel', async (query = null) => {
    try {
        let apiURL = `/api/${query.export_type}-export-excel`;
        const response = await axios.get(apiURL, {
            params: query,
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const dataURI = URL.createObjectURL(blob);

        // Use window.location.href to trigger the download
        const currentDate = new Date().toLocaleDateString('en-GB');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURI;
        downloadLink.download = `exports_${query.export_type}_${currentDate}.xlsx`;
        downloadLink.click();
    } catch (error) {
        throw error;
    }
});

export const generateDailyReport = createAsyncThunk('leads/generateDailyReport', async (query = null) => {
    try {
        let apiURL = `/api/daily-report`;
        const response = await axios.get(apiURL, {
            params: query,
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {type: 'application/pdf'});
        const dataURI = URL.createObjectURL(blob);
        //
        // Use window.location.href to trigger the download
        const currentDate = new Date().toLocaleDateString('en-GB');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURI;
        downloadLink.download = `daily_exports.pdf`;
        downloadLink.click();
    } catch (error) {
        throw error;
    }
});

const leadSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        resetLeadState: (state) => {
            state.lead = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeads.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload.leads;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
            .addCase(fetchAllLeads.fulfilled, (state, action) => {
                state.allLeads = action.payload.leads;
            })
            .addCase(fetchALead.fulfilled, (state, action) => {
                state.lead = action.payload;
            })
            .addCase(fetchLeadFilters.fulfilled, (state, action) => {
                state.filters = action.payload;
            })
            .addCase(createLead.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createLead.fulfilled, (state, action) => {
                state.isCreating = false;
                state.error = null;
            })
            .addCase(createLead.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message || 'An error occurred while creating a lead.';
            })
            .addCase(updateLead.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.error = null;
            })
            .addCase(updateLead.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message || 'An error occurred while updating a lead.';
            })
            .addCase(deleteLead.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.leads = state.leads.filter((lead) => lead.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteLead.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message || 'An error occurred while deleting a lead.';
            });
    },
});

export default leadSlice.reducer;
export const {resetLeadState} = leadSlice.actions;