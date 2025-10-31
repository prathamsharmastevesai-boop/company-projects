import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginSubmit } from "../../../Networking/Admin/APIs/LoginAPIs";
import { useDispatch } from "react-redux";
import RAGLoader from "../../../Component/Loader";
import side_photo from "../../../assets/side_photo.jpg";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const auth = JSON.parse(sessionStorage.getItem("auth"));

    if (token && auth?.isAuthenticated) {
      if (auth.role === "superuser") {
        navigate("/AdminManagement");
      } else if (auth.role === "user") {
        navigate("/dashboard");
      } else if (auth.role === "admin") {
        navigate("/AdminDashboard");
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await dispatch(
        LoginSubmit({ email, password, role: "admin" })
      ).unwrap();
      const { role, expiryTime } = res;

      if (role === "admin" || role === "superuser") {
        sessionStorage.setItem(
          "auth",
          JSON.stringify({ isAuthenticated: true, role })
        );
        sessionStorage.setItem("tokenExpiry", expiryTime);

        if (role === "admin") {
          toast.success("Admin login successful");
          navigate("/AdminDashboard");
        } else if (role === "superuser") {
          toast.success("Superuser login successful");
          navigate("/AdminManagement");
        }
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0 position-relative">
      <div
        className="d-none d-md-flex col-md-6 bg-dark text-white justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${side_photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="display-5  fw-bold">CRE Portfolio Pulse</h1>
      </div>

      <div className="col-12 col-md-6 d-flex justify-content-center align-items-center bg-white">
        <div className="w-100 px-4" style={{ maxWidth: "400px" }}>
          <h2 className="fw-bold mb-1">LOGIN</h2>
          <p className="text-muted mb-4">
            Enter your credentials and get ready to explore!
          </p>

          {errors.general && (
            <div className="alert alert-danger py-2">{errors.general}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Your Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              Log in
            </button>
          </form>
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
