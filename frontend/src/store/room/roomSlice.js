
// src/features/rooms/roomSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---- Gateway base URL ----
const API_BASE = "http://localhost:8086/roomsmicroservice/rooms";

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

// ---- Fallback data ----
const FALLBACK_ROOMS = [
  { id: 1000, name: "A1", type: "3-sharing", capacity: 3, occupied: 3, price: 5500, status: "Full" },
  { id: 2000, name: "A2", type: "3-sharing", capacity: 3, occupied: 2, price: 5500, status: "Available" },
  { id: 3000, name: "B1", type: "2-sharing", capacity: 2, occupied: 2, price: 6500, status: "Full" },
  { id: 4000, name: "C1", type: "4-sharing", capacity: 4, occupied: 3, price: 5000, status: "Available" },
];

// Normalize server response to UI shape
function normalizeRoom(item) {
  const raw = item?.status;
  let prettyStatus = "Available";
  if (typeof raw === "string") {
    if (raw === "AVAILABLE") prettyStatus = "Available";
    else if (raw === "FULL") prettyStatus = "Full";
    else prettyStatus = raw; // assume already "Available"/"Full"
  }
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    capacity: item.capacity,
    occupied: item.occupied,
    price: item.price,
    status: prettyStatus,
  };
}

// -------- Thunks --------

// Fetch rooms (optional query string)
export const fetchRooms = createAsyncThunk(
  "rooms/fetchAll",
  async ({ q } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("", { params: q ? { q } : {} });
      const data = Array.isArray(res.data) ? res.data : [];
      return data.map(normalizeRoom);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load rooms");
    }
  }
);

// Get one by id
export const fetchRoomById = createAsyncThunk(
  "rooms/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/${id}`);
      return normalizeRoom(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load room");
    }
  }
);

// Create
// RoomRequest: { name, type, capacity, occupied, price }
export const createRoom = createAsyncThunk(
  "rooms/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("", payload);
      return normalizeRoom(res.data ?? payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create room");
    }
  }
);

// Update by id
export const updateRoom = createAsyncThunk(
  "rooms/update",
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/${id}`, patch);
      return normalizeRoom(res.data ?? { id, ...patch });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update room");
    }
  }
);

// Allocate
export const allocateRoom = createAsyncThunk(
  "rooms/allocate",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/${id}/allocate`);
      return normalizeRoom(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to allocate room");
    }
  }
);

// Delete
export const deleteRoom = createAsyncThunk(
  "rooms/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete room");
    }
  }
);

// -------- Slice --------
const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    items: [],
    current: null,
    loading: false,  // list loading
    saving: false,   // create/update/allocate/delete
    error: null,
    lastQuery: "",
  },
  reducers: {
    clearRoomsError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchRooms.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg?.q ?? "";
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.length ? action.payload : FALLBACK_ROOMS;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load rooms";
        if (!state.items?.length) state.items = FALLBACK_ROOMS;
      })

      // Fetch one
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load room";
      })

      // Create
      .addCase(createRoom.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.saving = false;
        state.items = [action.payload, ...(state.items || [])];
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create room";
      })

      // Update
      .addCase(updateRoom.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.items.findIndex((r) => r.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
        else state.items.unshift(updated);
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update room";
      })

      // Allocate
      .addCase(allocateRoom.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(allocateRoom.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.items.findIndex((r) => r.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
      })
      .addCase(allocateRoom.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to allocate room";
      })

      // Delete
      .addCase(deleteRoom.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.saving = false;
        const { id } = action.payload;
        state.items = state.items.filter((r) => r.id !== id);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to delete room";
      });
  },
});

export const { clearRoomsError, setCurrentRoom } = roomsSlice.actions;

export const selectRooms = (state) => state.rooms.items;
export const selectRoomsLoading = (state) => state.rooms.loading;
export const selectRoomsSaving = (state) => state.rooms.saving;
export const selectRoomsError = (state) => state.rooms.error;
export const selectRoomsQuery = (state) => state.rooms.lastQuery;
export const selectCurrentRoom = (state) => state.rooms.current;

export default roomsSlice.reducer;
