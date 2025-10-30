import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { baseURL, login, Sigup, UserDelete } from "../../NWconfig";
import axios from "axios";
import axiosInstance from "./AxiosInstance";

export const LoginSubmit = createAsyncThunk(
  "auth/LoginSubmit",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(login, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      const token = response.data?.access_token;
      const role = response.data?.role;
      const expiresIn = response.data?.expires_in || 172800; // default 2 days
      const expiryTime = Date.now() + expiresIn * 1000;

      // if (token && role) {
      //   // ✅ Store session info
      //   sessionStorage.setItem("token", token);
      //   sessionStorage.setItem("auth", JSON.stringify({ role }));
      //   sessionStorage.setItem("tokenExpiry", expiryTime);

      return { access_token: token, role, expiryTime };
      // } else {
      //   return rejectWithValue("Invalid login response");
      // }
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        toast.error("Invalid email or password.");
        return rejectWithValue("Invalid email or password.");
      }

      const errMsg = error.response?.data?.message || "Login failed";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);
export const SignUpSubmit = createAsyncThunk(
  "auth/SignUpSubmit",
  async (credentials, { rejectWithValue }) => {
    try {
      const url = `${baseURL}${Sigup}`;
      const response = await axios.post(url, credentials, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const { access_token, role, expires_in, message } = response.data;

      if (!access_token && message) {
        toast.success(message);
        return { message };
      }

      if (access_token && role) {
        const expiryTime = Date.now() + (expires_in || 172800) * 1000;

        sessionStorage.setItem("token", access_token);
        sessionStorage.setItem(
          "auth",
          JSON.stringify({ isAuthenticated: true, role })
        );
        sessionStorage.setItem("tokenExpiry", expiryTime);

        toast.success(message || "Login successful");
        return { access_token, role };
      }

      return rejectWithValue("Invalid response from server");
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage =
              message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage =
              message ||
              "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage =
              message ||
              "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage =
              message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } else {
        const errMsg =
          message ||
          "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
  }
);

export const DeleteUser = createAsyncThunk(
  "auth/DeleteUser",
  async (email, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${UserDelete}?email=${email}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "User deletion failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
