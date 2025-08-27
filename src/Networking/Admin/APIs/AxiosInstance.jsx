import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("tokenExpiry");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
