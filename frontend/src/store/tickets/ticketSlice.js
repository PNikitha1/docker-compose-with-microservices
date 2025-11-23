
// src/features/tickets/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---- Gateway base URL ----
const API_BASE = "http://localhost:8086/ticketssmicroservice/tickets";

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

// ---- Helpers: enum <-> UI mapping ----
const toPriorityEnum = (p) => (p || "Medium").toUpperCase(); // "LOW|MEDIUM|HIGH"
const toStatusEnum = (s) => {
  if (!s) return "OPEN";
  const t = s.toUpperCase().replace(/\s+/g, "_"); // "IN_PROGRESS"
  return t;
};

const prettyPriority = (p) => {
  const v = (p || "MEDIUM").toUpperCase();
  if (v === "LOW" || v === "MEDIUM" || v === "HIGH") {
    return v.charAt(0) + v.slice(1).toLowerCase(); // Low/Medium/High
  }
  return p;
};

const prettyStatus = (s) => {
  const v = (s || "OPEN").toUpperCase();
  if (v === "IN_PROGRESS") return "In Progress";
  if (v === "OPEN" || v === "CLOSED") return v.charAt(0) + v.slice(1).toLowerCase(); // Open/Closed
  return s;
};

// Normalize server response to UI shape
function normalizeTicket(item) {
  return {
    id: item.id,
    ticketId: item.ticketId,
    title: item.title,
    room: item.room,
    priority: prettyPriority(item.priority), // UI-friendly
    description: item.description,
    status: prettyStatus(item.status),       // UI-friendly
    createdAt: item.createdAt,
  };
}

// -------- Thunks --------

// Fetch tickets (optional query string)
export const fetchTickets = createAsyncThunk(
  "tickets/fetchAll",
  async ({ q } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("", { params: q ? { q } : {} });
      const data = Array.isArray(res.data) ? res.data : [];
      return data.map(normalizeTicket);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tickets");
    }
  }
);

// Get one ticket by id
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/${id}`);
      return normalizeTicket(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load ticket");
    }
  }
);

// Create a new ticket
// TicketRequest: { title, room, priority, description }
export const createTicket = createAsyncThunk(
  "tickets/create",
  async ({ title, room, priority, description }, { rejectWithValue }) => {
    try {
      const payload = {
        title,
        room,
        priority: toPriorityEnum(priority), // enum expected by backend
        description,
      };
      const res = await axiosInstance.post("", payload);
      return normalizeTicket(res.data ?? payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create ticket");
    }
  }
);

// Update status: PATCH /{id}/status with { status: "OPEN|IN_PROGRESS|CLOSED" }
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const body = { status: toStatusEnum(status) };
      const res = await axiosInstance.patch(`/${id}/status`, body);
      return normalizeTicket(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

// Delete a ticket
export const deleteTicket = createAsyncThunk(
  "tickets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete ticket");
    }
  }
);

// -------- Slice --------
const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    items: [],
    current: null,
    loading: false, // list loading
    saving: false,  // create/update/delete
    error: null,
    lastQuery: "",
  },
  reducers: {
    clearTicketsError: (state) => {
      state.error = null;
    },
    setCurrentTicket: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTickets.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg?.q ?? "";
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load tickets";
        // keep items as-is; UI can show "No tickets yet."
      })

      // Fetch one
      .addCase(fetchTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.unshift(action.payload);
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load ticket";
      })

      // Create
      .addCase(createTicket.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.saving = false;
        state.items = [action.payload, ...(state.items || [])];
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create ticket";
      })

      // Update status
      .addCase(updateTicketStatus.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.items.findIndex((t) => t.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update status";
      })

      // Delete
      .addCase(deleteTicket.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.saving = false;
        const { id } = action.payload;
        state.items = state.items.filter((t) => t.id !== id);
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to delete ticket";
      });
  },
});

export const { clearTicketsError, setCurrentTicket } = ticketsSlice.actions;

export const selectTickets = (state) => state.tickets.items;
export const selectTicketsLoading = (state) => state.tickets.loading;
export const selectTicketsSaving = (state) => state.tickets.saving;
export const selectTicketsError = (state) => state.tickets.error;
export const selectTicketsQuery = (state) => state.tickets.lastQuery;
export const selectCurrentTicket = (state) => state.tickets.current;

export default ticketsSlice.reducer;
