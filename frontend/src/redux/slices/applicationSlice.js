// frontend/src/store/applicationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchApplications = createAsyncThunk(
  "profile/fetchApplications",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`applications/?task=${taskId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: "Failed to fetch applications" }
      );
    }
  }
);

export const createApplication = createAsyncThunk(
  "applications/createApplication",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.post("/applications/", { task: taskId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/applications/${applicationId}/`, {
        status,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (app) => app.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default applicationsSlice.reducer;
