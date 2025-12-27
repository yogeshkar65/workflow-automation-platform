import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
