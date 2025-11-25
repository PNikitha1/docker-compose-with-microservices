
// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Rooms from "./components/rooms/Rooms";
import Tenants from "./components/tenants/Tenants";
import Notices from "./components/notices/Notices";
import TicketRaise from "./components/tickets/TicketRaise";

// Guard
import RequireAuth from "./components/auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/rooms"
        element={
          <RequireAuth>
            <Rooms />
          </RequireAuth>
        }
      />
      <Route
        path="/tenants"
        element={
          <RequireAuth>
            <Tenants />
          </RequireAuth>
        }
      />
      <Route
        path="/notices"
        element={
          <RequireAuth>
            <Notices />
          </RequireAuth>
        }
      />
      <Route
        path="/tickets/raise"
        element={
          <RequireAuth>
            <TicketRaise />
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
