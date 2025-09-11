import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { baseURL, login, Sigup, UserDelete } from '../../NWconfig';
import axios from 'axios';


export const LoginSubmit = createAsyncThunk(
  'auth/LoginSubmit',
  async (credentials, { rejectWithValue }) => {
    try {
      const url = `${baseURL}${login}`;
      const response = await axios.post(url, credentials, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        }
      });

      const token = response.data?.access_token;
      const role = response.data?.role;
      const expiresIn = response.data?.expires_in || 172800;
      const expiryTime = Date.now() + expiresIn * 1000;

      if (token && role) {
        // 🔹 return only, don't set storage here
        return { access_token: token, role, expiryTime };
      } else {
        return rejectWithValue("Invalid login response");
      }
    } catch (error) {
      if (error.response?.status === 401) {
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
        sessionStorage.setItem("auth", JSON.stringify({ isAuthenticated: true, role }));
        sessionStorage.setItem("tokenExpiry", expiryTime);

        toast.success(message || "Login successful");
        return { access_token, role };
      }

      return rejectWithValue("Invalid response from server");
    } catch (error) {
      const status = error.response?.status;
      const errMsg = error.response?.data?.message || "Signup failed. Try again.";

      if (status === 401) {
        toast.error("Invalid email or password.");
        return rejectWithValue("Invalid email or password.");
      }

      toast.error(errMsg);
      return rejectWithValue(errMsg);
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
      const message =
        error.response?.data?.message || "User deletion failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

