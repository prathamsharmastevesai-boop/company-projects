import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authData = JSON.parse(sessionStorage.getItem("auth"));
  const role = authData?.role;

  const isAuthenticated = authData?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
