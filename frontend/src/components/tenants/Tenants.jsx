
// src/components/tenants/Tenants.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  exportTenantsCsv,
  selectTenants,
  selectTenantsLoading,
  selectTenantsSaving,
  selectTenantsExporting,
  selectTenantsError,
} from "../../store/tenants/tenantSlice";
import "./tenants.css";

export default function Tenants() {
  const dispatch = useDispatch();
  const tenants = useSelector(selectTenants);
  const loading = useSelector(selectTenantsLoading);
  const saving = useSelector(selectTenantsSaving);
  const exporting = useSelector(selectTenantsExporting);
  const error = useSelector(selectTenantsError);

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    tenantId: "",           // optional; slice will generate if blank
    name: "",
    phone: "",
    room: "",
    checkIn: "",            // YYYY-MM-DD
    due: 0,
  });

  // Initial load + debounced server-side search
  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      dispatch(fetchTenants({ q: q || undefined }));
    }, 250);
    return () => clearTimeout(t);
  }, [dispatch, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter(
      (t) =>
        (t.name || "").toLowerCase().includes(q) ||
        (t.phone || "").toLowerCase().includes(q) ||
        (t.room || "").toLowerCase().includes(q) ||
        (t.tenantId || "").toLowerCase().includes(q)
    );
  }, [tenants, query]);

  const resetForm = () => {
    setForm({
      tenantId: "",
      name: "",
      phone: "",
      room: "",
      checkIn: "",
      due: 0,
    });
  };

  const startCreate = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (tenant) => {
    setForm({
      tenantId: tenant.tenantId || "",
      name: tenant.name || "",
      phone: tenant.phone || "",
      room: tenant.room || "",
      checkIn: tenant.checkIn || "",
      due: Number(tenant.due || 0),
    });
    setEditingId(tenant.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const saveForm = async () => {
    // basic validation
    if (!form.name.trim() || !form.phone.trim() || !form.room.trim() || !form.checkIn.trim()) {
      return;
    }

    const payload = {
      tenantId: form.tenantId?.trim(), // slice generates if blank
      name: form.name.trim(),
      phone: form.phone.trim(),
      room: form.room.trim(),
      checkIn: form.checkIn.trim(),     // YYYY-MM-DD
      due: Number(form.due || 0),
    };

    try {
      if (editingId) {
        await dispatch(updateTenant({ id: editingId, patch: payload })).unwrap();
      } else {
        await dispatch(createTenant(payload)).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      console.error("Save tenant failed:", e);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this tenant?")) return;
    try {
      await dispatch(deleteTenant(id)).unwrap();
    } catch (e) {
      console.error("Delete tenant failed:", e);
    }
  };

  const exportCsv = async () => {
    try {
      const blob = await dispatch(exportTenantsCsv({ q: query.trim() || undefined })).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tenants.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h2>Tenants</h2>
        <div className="actions">
          <input
            className="input"
            placeholder="Search by name/phone/room/tenantId..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <button className="btn solid" onClick={startCreate} disabled={saving} style={{ marginLeft: 8 }}>
            {saving ? "Saving..." : "Add Tenant"}
          </button>
          <button className="btn outline" onClick={exportCsv} disabled={exporting} style={{ marginLeft: 8 }}>
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-head">
            <h3>{editingId ? "Edit Tenant" : "Add Tenant"}</h3>
          </div>
          <div className="form-grid">
            <label>
              Tenant ID (optional)
              <input
                className="input"
                value={form.tenantId}
                onChange={(e) => setForm((p) => ({ ...p, tenantId: e.target.value }))}
                placeholder="e.g., T001 (auto-generated if blank)"
              />
            </label>
            <label>
              Name
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label>
              Phone
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="9XXXXXXXXX"
              />
            </label>
            <label>
              Room
              <input
                className="input"
                value={form.room}
                onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
                placeholder="e.g., A1"
              />
            </label>
            <label>
              Check-In
              <input
                type="date"
                className="input"
                value={form.checkIn}
                onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))}
              />
            </label>
            <label>
              Due (₹)
              <input
                type="number"
                className="input"
                min={0}
                value={form.due}
                onChange={(e) => setForm((p) => ({ ...p, due: Number(e.target.value) }))}
              />
            </label>
          </div>
          <div className="actions">
            <button className="btn solid" onClick={saveForm} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button className="btn outline" onClick={cancelForm} disabled={saving} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="muted" style={{ padding: 8 }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="muted" style={{ padding: 8 }}>No tenants found</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Phone</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Due</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {t.tenantId ? `ID: ${t.tenantId}` : ""}
                  </div>
                </td>
                <td>{t.phone}</td>
                <td>{t.room}</td>
                <td>{t.checkIn}</td>
                <td className={Number(t.due) > 0 ? "due" : "ok"}>
                  {Number(t.due) > 0 ? `₹ ${Number(t.due).toLocaleString("en-IN")}` : "—"}
                </td>
                <td>
                  <button className="btn small outline" onClick={() => startEdit(t)} disabled={saving}>
                    Edit
                  </button>
                  <button
                    className="btn small danger"
                    onClick={() => remove(t.id)}
                    disabled={saving}
                    style={{ marginLeft: 8 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
