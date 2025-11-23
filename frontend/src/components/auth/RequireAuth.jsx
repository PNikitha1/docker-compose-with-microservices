
// src/routes/RequireAuth.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../../store/auth/authSlice";

export default function RequireAuth({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Keep the location so you can return after login if you want
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
