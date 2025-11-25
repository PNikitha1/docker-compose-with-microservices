
// src/components/notices/Notices.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotices,
  createNotice,
  updateNotice,
  selectNotices,
  selectNoticesLoading,
  selectNoticesError,
} from "../../store/notices/noticeSlice";
import "./notices.css";

export default function Notices() {
  const dispatch = useDispatch();
  const notices = useSelector(selectNotices);
  const loading = useSelector(selectNoticesLoading);
  const error = useSelector(selectNoticesError);

  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState({ noticeId: null, title: "" });

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const addNotice = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await dispatch(createNotice({ title: trimmed }));
    setTitle("");
  };

  const startEdit = (n) => {
    setEditing({ noticeId: n.noticeId, title: n.title });
  };

  const cancelEdit = () => {
    setEditing({ noticeId: null, title: "" });
  };

  const saveEdit = async () => {
    if (!editing.noticeId) return;
    const trimmed = editing.title.trim();
    if (!trimmed) return;
    await dispatch(updateNotice({ noticeId: editing.noticeId, changes: { title: trimmed } }));
    cancelEdit();
  };

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h2>Notices</h2>

        <div className="actions">
          <input
            className="input"
            placeholder="Write a quick notice..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn solid" onClick={addNotice} disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </button>
        </div>

        {error ? <div className="error">{error}</div> : null}
      </div>

      {loading && notices.length === 0 ? (
        <div className="muted" style={{ padding: 8 }}>Loading...</div>
      ) : null}

      <ul className="list">
        {notices.map((n) => {
          const isEditing = editing.noticeId === n.noticeId;
          return (
            <li key={n.noticeId} className="list-item">
              {!isEditing ? (
                <>
                  <div className="list-title">{n.title}</div>
                  <div className="list-meta">
                    {new Date(n.date).toLocaleDateString("en-IN")}
                  </div>
                  <div className="list-actions">
                    <button className="btn outline" onClick={() => startEdit(n)}>Edit</button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    className="input"
                    value={editing.title}
                    onChange={(e) => setEditing((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <div className="list-actions">
                    <button className="btn solid" onClick={saveEdit} disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button className="btn outline" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
