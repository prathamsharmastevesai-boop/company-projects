import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("access_token");
  const role = sessionStorage.getItem("role");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !role) return;

    const logoutUser = () => {
      toast.warning("You have been logged out due to inactivity.");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("role");
      navigate("/");
    };

    let timer;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logoutUser, 180000);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token, role, navigate]);



  if (!token || !role) {
    return <Navigate to="/" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;
