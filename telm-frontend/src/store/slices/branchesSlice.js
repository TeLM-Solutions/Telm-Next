import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '@/lib/axios';

const initialState = {
    branches: [],
    branch: null,
    pagination: null,
    loading: false,
    loadingSingle: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
};

export const fetchBranches = createAsyncThunk('branches/fetchBranches', async (query = null) => {
    try {
        let apiURL = '/api/branches';
        if (query) {
            apiURL = `${apiURL}?q=${query.q}&page=${query.p}`
        }
        const response = await axios.get(apiURL); // Adjust the API endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const fetchAllActiveBranches = createAsyncThunk('branches/fetchAllActiveBranches', async (query = null) => {
    try {
        let apiURL = '/api/branches/all';
        const response = await axios.get(apiURL, {
            params: query
        }); // Adjust the API endpoint
        return response.data.branches;
    } catch (error) {
        throw error;
    }
});

export const fetchABranch = createAsyncThunk('branches/fetchABranch', async (id) => {
    try {
        const response = await axios.get(`/api/branches/${id}`); // Adjust the API endpoint
        return response.data.branch;
    } catch (error) {
        throw error;
    }
});

export const createBranch = createAsyncThunk('branches/createBranch', async (branchData) => {
    try {
        const response = await axios.post('/api/branches', branchData); // Adjust the API endpoint
        return response.data.branch;
    } catch (error) {
        throw error;
    }
});

export const updateBranch = createAsyncThunk('branches/updateBranch', async (data) => {
    const {id, branchData} = data;
    try {
        const response = await axios.put(`/api/branches/${id}`, branchData); // Adjust the API endpoint
        return response.data.branch;
    } catch (error) {
        throw error;
    }
});

export const deleteBranch = createAsyncThunk('branches/deleteBranch', async (id) => {
    try {
        await axios.delete(`/api/branches/${id}`); // Adjust the API endpoint
        return id;
    } catch (error) {
        throw error;
    }
});

const branchesSlice = createSlice({
    name: 'branches',
    initialState,
    reducers: {
        resetBranchState: (state) => {
            state.branch = null;
        },
        resetBranchesState: (state) => {
            state.branches = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload.branches;
                state.pagination = action.payload.pagination;
                state.error = null
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAllActiveBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload;
                state.error = null
            })
            .addCase(fetchABranch.pending, (state) => {
                state.loadingSingle = true;
            })
            .addCase(fetchABranch.fulfilled, (state, action) => {
                state.loadingSingle = false;
                state.branch = action.payload;
            })
            .addCase(fetchABranch.rejected, (state, action) => {
                state.loadingSingle = false;
                state.error = action.error.message;
            })
            .addCase(createBranch.pending, (state) => {
                state.isCreating = true;
            })
            .addCase(createBranch.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createBranch.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.error.message;
            })
            .addCase(updateBranch.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedIndex = state.branches.findIndex((branch) => branch.id === action.payload.id);
                console.log(updatedIndex)
                if (updatedIndex !== -1) {
                    state.branches[updatedIndex] = action.payload;
                }
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.error.message;
            })
            .addCase(deleteBranch.pending, (state) => {
                state.isDeleting = true;
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.branches = state.branches.filter((branch) => branch.id !== action.payload);
            })
            .addCase(deleteBranch.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.error.message;
            });
    },
});

export default branchesSlice.reducer;
export const {resetBranchState, resetBranchesState} = branchesSlice.actions;