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
            toast.error(error.response?.data?.message || "OTP failed");
            throw error;
        }
    }
);

