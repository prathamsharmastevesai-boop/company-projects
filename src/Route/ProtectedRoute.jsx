import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("access_token");
  const role = sessionStorage.getItem("role");

  // ❌ Not logged in
  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoute;
