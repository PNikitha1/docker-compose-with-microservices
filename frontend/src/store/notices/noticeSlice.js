
// src/features/notices/noticeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// ---- Gateway base URL ----
// Matches: http://localhost:8086/noticessmicroservice/notices/**
const API_BASE = "http://localhost:8086/noticessmicroservice/notices";

// ---- Axios instance with token interceptor ----
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Fallback mock data if backend returns empty or fails ----
const FALLBACK_NOTICES = [
  { noticeId: "N011", title: "Rent due by 5th Dec", date: "2025-11-20T00:00:00.000Z" },
  { noticeId: "N012", title: "Housekeeping hours updated", date: "2025-11-18T00:00:00.000Z" },
];

// Utility: generate a client-side noticeId (e.g., N123)
//const genNoticeId = () => `N${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

// -------- Thunks --------

// Load all notices
export const fetchNotices = createAsyncThunk(
  "notices/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("");
      const data = Array.isArray(res.data) ? res.data : [];
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load notices");
    }
  }
);

// Create a new notice (title required). Backend expects Instant for 'date' which ISO string satisfies.
// export const createNotice = createAsyncThunk(
//   "notices/create",
//   async ({ title }, { rejectWithValue }) => {
//     try {
//       const payload = {
//         noticeId: genNoticeId(),
//         title: title,
//         date: new Date().toISOString(),
//       };
//       const res = await axiosInstance.post("", payload);
//       return res.data ?? payload; // if backend sends back created entity, use it; else fallback to payload
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to create notice");
//     }
//   }
// );


export const createNotice = createAsyncThunk(
  "notices/create",
  async ({ title }, { rejectWithValue }) => {
    try {
      const payload = {
        noticeId: uuidv4(),                 // <--- UUID here
        title,
        date: new Date().toISOString(),     // Spring Instant-compatible
      };
     const res = await axiosInstance.post("", payload);
      return res.data ?? payload;           // fallback to client payload if backend doesn't echo
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create notice");
    }
  }
);
// Update a notice by noticeId. `changes` can include `title` (and optionally `date` if you want).
export const updateNotice = createAsyncThunk(
  "notices/update",
  async ({ noticeId, changes }, { getState, rejectWithValue }) => {
    try {
      // Grab the current item from state to send full entity on PUT
      const state = getState();
      const existing = state.notices.items.find((n) => n.noticeId === noticeId);

      const updated = {
        // If backend requires DB id, include `id: existing?.id` here
        noticeId,
        title: changes.title ?? existing?.title ?? "",
        date: changes.date ?? existing?.date ?? new Date().toISOString(),
      };

      const res = await axiosInstance.put(`/${noticeId}`, updated);
      return res.data ?? updated; // in case backend doesn't echo, use our updated
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update notice");
    }
  }
);

// -------- Slice --------
const noticesSlice = createSlice({
  name: "notices",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optional local edit (optimistic): instantly changes title client-side
    updateLocalNoticeTitle: (state, action) => {
      const { noticeId, title } = action.payload;
      const idx = state.items.findIndex((n) => n.noticeId === noticeId);
      if (idx >= 0) {
        state.items[idx].title = title;
      }
    },
    // Reset error
    clearNoticeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        const serverItems = action.payload || [];
        // Fallback to mock if backend returns empty
        state.items = serverItems.length ? serverItems : FALLBACK_NOTICES;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load notices";
        // If nothing loaded yet, show fallback so UI still works
        if (!state.items || state.items.length === 0) {
          state.items = FALLBACK_NOTICES;
        }
      })

      // Create
      .addCase(createNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend newly created notice
        state.items = [action.payload, ...(state.items || [])];
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create notice";
      })

      // Update
      .addCase(updateNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.items.findIndex((n) => n.noticeId === updated.noticeId);
        if (idx >= 0) {
          state.items[idx] = { ...state.items[idx], ...updated };
        } else {
          // If not found (rare), add it
          state.items.push(updated);
        }
      })
      .addCase(updateNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update notice";
      });
  },
});

export const {
  updateLocalNoticeTitle,
  clearNoticeError,
} = noticesSlice.actions;

export const selectNotices = (state) => state.notices.items;
export const selectNoticesLoading = (state) => state.notices.loading;
export const selectNoticesError = (state) => state.notices.error;

export default noticesSlice.reducer;
