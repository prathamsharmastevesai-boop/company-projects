import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { LoginSubmit } from "../../../Networking/Admin/APIs/LoginAPIs";
import RAGLoader from "../../../Component/Loader";
import headerimage from "../../../assets/images.jpeg";
import side_photo from "../../../assets/side_photo.png";

export const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const auth = JSON.parse(sessionStorage.getItem("auth"));

    if (token && auth?.isAuthenticated) {
      if (auth.role === "user") {
        navigate("/dashboard");
      } else if (auth.role === "admin") {
        navigate("/CreateBuilding");
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const payload = { email, password, role: "user" };

    try {
      const res = await dispatch(LoginSubmit(payload)).unwrap();
      const userRole = res.role;
      const token = res.token;

      if (window.ReactNativeWebView && token) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "LOGIN_SUCCESS",
          token: token,
          role: userRole,
        }));
      }

      if (userRole === "admin") {
        navigate("/CreateBuilding");
      } else if (userRole === "user") {
        navigate("/dashboard", { state: { email } });
      } else {
        toast.error("Unauthorized role.");
      }
    } catch (err) {
      const message = err?.message || "Login failed. Please check your credentials.";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex vh-100 position-relative">
      <div
        className="d-none d-md-flex col-md-6 bg-dark text-white justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${side_photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <h1 className="display-5 fw-bold position-relative z-1">CRE Portfolio Pulse</h1>
      </div>

      <div className="login-right col-12 col-md-6 d-flex justify-content-center align-items-center bg-white">
        <div className="login-card shadow rounded p-4 w-100" style={{ maxWidth: "400px" }}>
          <div className="mb-4 text-center">
            <img src={headerimage} alt="Logo" style={{ height: 80, width: 100 }} />
            <h4 className="fw-bold mt-3">USER LOGIN</h4>
            <p className="text-muted small">Please enter your details</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3 text-end">
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/ForgotPassword")}
              >
                Forgot password?
              </span>
            </div>

            <button type="submit" className="btn btn-dark w-100 mb-3" disabled={loading}>
              {loading ? <RAGLoader /> : "Sign in"}
            </button>
          </form>

          <p className="text-center">
            Are you new?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/SignUp")}
            >
              Create an Account
            </span>
          </p>
        </div>
      </div>

      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 9999 }}
        >
          <RAGLoader />
        </div>
      )}
    </div>
  );
};
