
// src/components/tickets/TicketRaise.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
  selectTickets,
  selectTicketsLoading,
  selectTicketsSaving,
  selectTicketsError,
} from "../../store/tickets/ticketSlice"; // adjust path as needed
import "./tickets.css";

export default function TicketRaise() {
  const dispatch = useDispatch();
  const tickets = useSelector(selectTickets);
  const loading = useSelector(selectTicketsLoading);
  const saving = useSelector(selectTicketsSaving);
  const error = useSelector(selectTicketsError);

  const [form, setForm] = useState({
    title: "",
    room: "",
    priority: "Medium", // UI values: Low/Medium/High
    description: "",
  });

  // initial load
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await dispatch(
        createTicket({
          title: form.title.trim(),
          room: form.room.trim(),
          priority: form.priority,         // slice maps to enum
          description: form.description.trim(),
        })
      ).unwrap();
      setForm({ title: "", room: "", priority: "Medium", description: "" });
    } catch (err) {
      console.error("Create ticket failed:", err);
    }
  };

  const setStatus = async (id, next) => {
    try {
      await dispatch(updateTicketStatus({ id, status: next })).unwrap();
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await dispatch(deleteTicket(id)).unwrap();
    } catch (err) {
      console.error("Delete ticket failed:", err);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h2>Raise Maintenance Ticket</h2>
      </div>

      <form className="form" onSubmit={submit}>
        <label>Title</label>
        <input
          className="input"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g., Water leakage in washroom"
        />

        <label>Room</label>
        <input
          className="input"
          value={form.room}
          onChange={(e) => update("room", e.target.value)}
          placeholder="e.g., A2"
        />

        <label>Priority</label>
        <select
          className="input"
          value={form.priority}
          onChange={(e) => update("priority", e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label>Description</label>
        <textarea
          className="input"
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Add details to help staff resolve faster..."
        />

        <div className="actions">
          <button className="btn solid" type="submit" disabled={saving}>
            {saving ? "Submitting..." : "Submit Ticket"}
          </button>
          <button
            className="btn outline"
            type="reset"
            onClick={() => setForm({ title: "", room: "", priority: "Medium", description: "" })}
            disabled={saving}
          >
            Clear
          </button>
        </div>
      </form>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h3>Recently Raised</h3>
        </div>

        {error ? <div className="error">{error}</div> : null}
        {loading ? (
          <div className="muted" style={{ padding: 8 }}>Loading...</div>
        ) : tickets.length === 0 ? (
          <ul className="list"><li className="list-item muted">No tickets yet.</li></ul>
        ) : (
          <ul className="list">
            {tickets.map((tk) => (
              <li key={tk.id} className="list-item">
                <div className="list-title">{tk.title}</div>
                <div className="list-meta">
                  <span>Room {tk.room || "-"}</span> •
                  <span style={{ marginLeft: 6 }}>Priority: {tk.priority}</span> •
                  <span style={{ marginLeft: 6 }}>Status: {tk.status}</span> •
                  <span style={{ marginLeft: 6 }}>
                    {tk.createdAt ? new Date(tk.createdAt).toLocaleString("en-IN") : ""}
                  </span>
                </div>

                <div className="list-actions" style={{ marginTop: 8 }}>
                  <button
                    className="btn small outline"
                    onClick={() => setStatus(tk.id, "Open")}
                    disabled={saving || tk.status === "Open"}
                  >
                    Open
                  </button>
                  <button
                    className="btn small outline"
                    onClick={() => setStatus(tk.id, "In Progress")}
                    disabled={saving || tk.status === "In Progress"}
                    style={{ marginLeft: 8 }}
                  >
                    In Progress
                  </button>
                  <button
                    className="btn small solid"
                    onClick={() => setStatus(tk.id, "Closed")}
                    disabled={saving || tk.status === "Closed"}
                    style={{ marginLeft: 8 }}
                  >
                    Close
                  </button>

                  <button
                    className="btn small danger"
                    onClick={() => remove(tk.id)}
                    disabled={saving}
                    style={{ marginLeft: 12 }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
