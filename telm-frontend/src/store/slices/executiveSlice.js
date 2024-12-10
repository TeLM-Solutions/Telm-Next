// executiveSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "@/lib/axios";

const initialState = {
    executives: [],
    executive: null,
    pagination: null,
    allExecutives: [],
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

export const fetchExecutives = createAsyncThunk('executives/fetchExecutives', async (query = null) => {
    try {
        let apiURL = '/api/executives';
        if (query) {
            apiURL = `${apiURL}?q=${query.q}&page=${query.p}`
        }
        const response = await axios.get(apiURL); // Adjust the API endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchAllExecutives = createAsyncThunk('executives/fetchAllExecutives', async (query = null) => {
    try {
        let apiURL = '/api/executives/all';
        const response = await axios.get(apiURL, {
            params: query
        }); // Adjust the API endpoint
        return response.data.executives;
    } catch (error) {
        throw error;
    }
});

export const fetchAExecutive = createAsyncThunk('executives/fetchAExecutive', async (id) => {
    try {
        const response = await axios.get(`/api/executives/${id}`); // Adjust the API endpoint
        return response.data.executive;
    } catch (error) {
        throw error;
    }
});

// export const fetchExecutivesSilently = createAsyncThunk('executives/fetchExecutivesSilently', async () => {
//     try {
//         const response = await axios.get('/api/executives'); // Adjust the API endpoint
//         return response.data.executives;
//     } catch (error) {
//         throw error;
//     }
// });

// Create async thunks for creating, updating, and deleting executives
export const createExecutive = createAsyncThunk(
    'executives/createExecutive', async (executiveData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/executives', executiveData);
            return response.data.executive;
        } catch (error) {
            if (error.response.status === 422) {
                // Handle the specific case of a validation error (email already exists)
                return rejectWithValue(error.response.data.errors);
            } else {
                throw error; // Re-throw other errors
            }
        }
    });

export const updateExecutive = createAsyncThunk('executives/updateExecutive', async (executiveData, {rejectWithValue}) => {
    const {id, data} = executiveData;
    try {
        const response = await axios.put(`/api/executives/${id}`, data); // Adjust the API endpoint
        return response.data.executive;
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

export const deleteExecutive = createAsyncThunk('executives/deleteExecutive', async (executiveId) => {
    try {
        await axios.delete(`/api/executives/${executiveId}`); // Adjust the API endpoint
        return executiveId;
    } catch (error) {
        throw error;
    }
});

const executiveSlice = createSlice({
    name: 'branchExecutives',
    initialState,
    reducers: {
        resetExecutiveState: (state) => {
            state.executive = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExecutives.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExecutives.fulfilled, (state, action) => {
                state.loading = false;
                state.executives = action.payload.executives;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchExecutives.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            })
            .addCase(fetchAllExecutives.fulfilled, (state, action) => {
                state.allExecutives = action.payload;
            })
            .addCase(fetchAExecutive.fulfilled, (state, action) => {
                state.executive = action.payload;
            })
            .addCase(createExecutive.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createExecutive.fulfilled, (state, action) => {
                state.isCreating = false;
                state.error = null;
            })
            .addCase(createExecutive.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message || 'An error occurred while creating a executive.';
            })
            .addCase(updateExecutive.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateExecutive.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedExecutiveIndex = state.executives.findIndex((executive) => executive.id === action.payload.id);
                if (updatedExecutiveIndex !== -1) {
                    state.executives[updatedExecutiveIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateExecutive.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message || 'An error occurred while updating a executive.';
            })
            .addCase(deleteExecutive.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteExecutive.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.executives = state.executives.filter((executive) => executive.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteExecutive.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message || 'An error occurred while deleting a executive.';
            });
    },
});

export default executiveSlice.reducer;

export const {resetExecutiveState} = executiveSlice.actions;