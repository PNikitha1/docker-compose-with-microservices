
// src/components/rooms/Rooms.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRooms,
  createRoom,
  updateRoom,
  allocateRoom,
  deleteRoom,
  selectRooms,
  selectRoomsLoading,
  selectRoomsSaving,
  selectRoomsError,
} from "../../store/room/roomSlice"; // <-- adjust path if needed
import "./rooms.css";

export default function Rooms() {
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const loading = useSelector(selectRoomsLoading);
  const saving = useSelector(selectRoomsSaving);
  const error = useSelector(selectRoomsError);

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "3-sharing",
    capacity: 3,
    occupied: 0,
    price: 5000,
  });

  // Fetch (server-side search) with small debounce
  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      dispatch(fetchRooms({ q: q || undefined }));
    }, 250);
    return () => clearTimeout(t);
  }, [dispatch, query]);

  const filtered = useMemo(() => {
    // Optional client-side filter on top of server results
    const q = query.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rooms, query]);

  const resetForm = () => {
    setForm({ name: "", type: "3-sharing", capacity: 3, occupied: 0, price: 5000 });
  };

  const startCreate = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (room) => {
    setForm({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      occupied: room.occupied,
      price: room.price,
    });
    setEditingId(room.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const saveForm = async () => {
    if (!form.name.trim() || !form.type.trim()) return;
    try {
      if (editingId) {
        await dispatch(updateRoom({ id: editingId, patch: form })).unwrap();
      } else {
        await dispatch(createRoom(form)).unwrap();
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      console.error("Save room failed:", e);
    }
  };

  const handleAllocate = async (id) => {
    try {
      await dispatch(allocateRoom(id)).unwrap();
    } catch (e) {
      console.error("Allocate failed:", e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    try {
      await dispatch(deleteRoom(id)).unwrap();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h2>Rooms</h2>
        <div className="actions">
          <input
            className="input"
            placeholder="Search by name/type/status..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn solid" onClick={startCreate}>
            Add Room
          </button>
        </div>
        {error ? <div className="error">{error}</div> : null}
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-head">
            <h3>{editingId ? "Edit Room" : "Add Room"}</h3>
          </div>
          <div className="form-grid">
            <label>
              Name
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label>
              Type
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                <option>1-sharing</option>
                <option>2-sharing</option>
                <option>3-sharing</option>
                <option>4-sharing</option>
              </select>
            </label>
            <label>
              Capacity
              <input
                type="number"
                className="input"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))}
              />
            </label>
            <label>
              Occupied
              <input
                type="number"
                className="input"
                min={0}
                value={form.occupied}
                onChange={(e) => setForm((p) => ({ ...p, occupied: Number(e.target.value) }))}
              />
            </label>
            <label>
              Price (₹)
              <input
                type="number"
                className="input"
                min={0}
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
              />
            </label>
          </div>
          <div className="actions">
            <button className="btn solid" onClick={saveForm} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button className="btn outline" onClick={cancelForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      
{loading ? (
  <div className="muted" style={{ padding: 8 }}>Loading...</div>
) : rooms.length === 0 ? (
  <div className="muted" style={{ padding: 8 }}>No rooms found</div>
) : null}


      <div className="rooms-grid">
        {filtered.map((r) => (
          <div key={r.id} className={`room-card ${r.status === "Full" ? "full" : "available"}`}>
            <div className="room-header">
              <div className="room-name">{r.name}</div>
              <span className={`pill ${r.status.toLowerCase()}`}>{r.status}</span>
            </div>
            <div className="room-body">
              <div><strong>Type:</strong> {r.type}</div>
              <div><strong>Capacity:</strong> {r.capacity}</div>
              <div><strong>Occupied:</strong> {r.occupied}</div>
              <div><strong>Price:</strong> ₹ {Number(r.price).toLocaleString("en-IN")}</div>
            </div>
            <div className="room-actions">
              <button
                className="btn small solid"
                onClick={() => handleAllocate(r.id)}
                disabled={saving}
              >
                {saving ? "Allocating..." : "Allocate"}
              </button>
              <button
                className="btn small outline"
                onClick={() => startEdit(r)}
                disabled={saving}
              >
                Edit
              </button>
              <button
                className="btn small danger"
                onClick={() => handleDelete(r.id)}
                disabled={saving}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
