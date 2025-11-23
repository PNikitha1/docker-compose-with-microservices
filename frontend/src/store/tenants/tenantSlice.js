
// src/features/tenants/tenantSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---- Gateway base URL ----
const API_BASE = "http://localhost:8086/tenantsmicroservice/tenants";

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

// ---- Fallback mock data (if backend empty or fails) ----
const FALLBACK_TENANTS = [
  { id: 1000, tenantId: "T001", name: "Rahul Sharma", phone: "9XXXXXXXX1", room: "A1", checkIn: "2025-09-03", due: 0 },
  { id: 2000, tenantId: "T002", name: "Pooja Rao", phone: "9XXXXXXXX2", room: "A2", checkIn: "2025-10-10", due: 1500 },
  { id: 3000, tenantId: "T003", name: "Venkatesh K", phone: "9XXXXXXXX3", room: "B1", checkIn: "2025-08-28", due: 0 },
];

// If request requires tenantId and you don't have one, generate a short friendly ID.
// Column length is 16, so keep it compact.
const generateTenantId = () => {
  const suffix = String(Date.now()).slice(-6); // last 6 digits of epoch
  return `T${suffix}`; // e.g., T391245
};

// Normalize server response to UI shape
function normalizeTenant(item) {
  return {
    id: item.id,
    tenantId: item.tenantId,
    name: item.name,
    phone: item.phone,
    room: item.room,
    // checkIn from backend is already an ISO date string (e.g., "2025-09-03")
    checkIn: item.checkIn,
    due: typeof item.due === "number" ? item.due : Number(item.due || 0),
  };
}

// -------- Thunks --------

// Fetch tenants (optional search query `q`)
export const fetchTenants = createAsyncThunk(
  "tenants/fetchAll",
  async ({ q } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("", { params: q ? { q } : {} });
      const data = Array.isArray(res.data) ? res.data : [];
      return data.map(normalizeTenant);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tenants");
    }
  }
);

// Fetch single tenant by id
export const fetchTenantById = createAsyncThunk(
  "tenants/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/${id}`);
      return normalizeTenant(res.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tenant");
    }
  }
);

// Create tenant (TenantRequest requires: tenantId, name, phone, room, checkIn, due)
export const createTenant = createAsyncThunk(
  "tenants/create",
  async (payload, { rejectWithValue }) => {
    try {
      const body = {
        tenantId: payload.tenantId || generateTenantId(),
        name: payload.name,
        phone: payload.phone,
        room: payload.room,
        // For LocalDate, send "YYYY-MM-DD" format
        checkIn: payload.checkIn, // assume "YYYY-MM-DD"
        due: typeof payload.due === "number" ? payload.due : Number(payload.due || 0),
      };
      const res = await axiosInstance.post("", body);
      return normalizeTenant(res.data ?? body);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create tenant");
    }
  }
);

// Update tenant
export const updateTenant = createAsyncThunk(
  "tenants/update",
  async ({ id, patch }, { rejectWithValue }) => {
    try {
      const body = {
        tenantId: patch.tenantId, // keep as-is to maintain uniqueness; or allow server to ignore if unchanged
        name: patch.name,
        phone: patch.phone,
        room: patch.room,
        checkIn: patch.checkIn,
        due: typeof patch.due === "number" ? patch.due : Number(patch.due || 0),
      };
      const res = await axiosInstance.put(`/${id}`, body);
      return normalizeTenant(res.data ?? { id, ...body });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update tenant");
    }
  }
);

// Delete tenant
export const deleteTenant = createAsyncThunk(
  "tenants/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete tenant");
    }
  }
);

// Export CSV (optional q); returns Blob to be handled by component
export const exportTenantsCsv = createAsyncThunk(
  "tenants/exportCsv",
  async ({ q } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/export", {
        params: q ? { q } : {},
        responseType: "blob", // server produces text/csv
      });
      return res.data; // Blob
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to export CSV");
    }
  }
);

// -------- Slice --------
const tenantsSlice = createSlice({
  name: "tenants",
  initialState: {
    items: [],
    current: null,
    loading: false,     // list loading
    saving: false,      // create/update/delete
    exporting: false,   // CSV export
    error: null,
    lastQuery: "",
  },
  reducers: {
    clearTenantsError: (state) => {
      state.error = null;
    },
    setCurrentTenant: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTenants.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg?.q ?? "";
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.length ? action.payload : FALLBACK_TENANTS;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load tenants";
        if (!state.items?.length) state.items = FALLBACK_TENANTS;
      })

      // Fetch one
      .addCase(fetchTenantById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.unshift(action.payload);
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load tenant";
      })

      // Create
      .addCase(createTenant.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.saving = false;
        state.items = [action.payload, ...(state.items || [])];
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create tenant";
      })

      // Update
      .addCase(updateTenant.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.items.findIndex((t) => t.id === updated.id);
        if (idx >= 0) state.items[idx] = updated;
        else state.items.unshift(updated);
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update tenant";
      })

      // Delete
      .addCase(deleteTenant.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.saving = false;
        const { id } = action.payload;
        state.items = state.items.filter((t) => t.id !== id);
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to delete tenant";
      })

      // Export CSV
      .addCase(exportTenantsCsv.pending, (state) => {
        state.exporting = true;
        state.error = null;
      })
      .addCase(exportTenantsCsv.fulfilled, (state) => {
        state.exporting = false;
        // Blob is returned to component via unwrap(); we don't store it in state.
      })
      .addCase(exportTenantsCsv.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload || "Failed to export CSV";
      });
  },
});

export const { clearTenantsError, setCurrentTenant } = tenantsSlice.actions;

// Selectors
export const selectTenants = (state) => state.tenants.items;
export const selectTenantsLoading = (state) => state.tenants.loading;
export const selectTenantsSaving = (state) => state.tenants.saving;
export const selectTenantsExporting = (state) => state.tenants.exporting;
export const selectTenantsError = (state) => state.tenants.error;
export const selectTenantsQuery = (state) => state.tenants.lastQuery;
export const selectCurrentTenant = (state) => state.tenants.current;

export default tenantsSlice.reducer;
