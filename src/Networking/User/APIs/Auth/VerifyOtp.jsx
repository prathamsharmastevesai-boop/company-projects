import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { baseURL, ForgetPassword, ResetPasswod, VerifyOtp } from '../../../NWconfig';
import axios from 'axios';


export const Forget_passwordSubmit = createAsyncThunk(
    'auth/Forget_passwordSubmit',
    async (credentials) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${ForgetPassword}`;
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            toast.success(response.data.message)
            return response.data;
        } catch (error) {
             if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("tokenExpiry");
      window.location.href = "/";
    }
            toast.error(error.response?.data?.message || "OTP failed");
            throw error;
        }
    }
);

export const VerifyOtpSubmit = createAsyncThunk(
    'auth/VerifyOtpSubmit',
    async (credentials) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${VerifyOtp}`;
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            toast.success(response.data.message)
            return response.data;
        } catch (error) {
             if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("tokenExpiry");
      window.location.href = "/";
    }
            toast.error(error.response?.data?.message || "OTP failed");
            throw error;
        }
    }
);

export const Reset_password_Submit = createAsyncThunk(
    'auth/Reset_password_Submit',
    async (credentials) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${ResetPasswod}`;
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
            });
            toast.success(response.data.message)
            return response.data;
        } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } 
      else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage = message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage = message || "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = message || "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage = message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
      else {
        const errMsg = message || "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
    }
);

