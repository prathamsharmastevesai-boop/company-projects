import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, dashboardData, SystemTracing } from '../../NWconfig';


export const getdashboardApi = createAsyncThunk(
    'getdashboardApi',
    async () => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${dashboardData}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Lease creation failed");
            throw error;
        }
    }
);


export const getsystemtracingApi = createAsyncThunk(
    'getsystemtracingApi',
    async () => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${SystemTracing}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Lease creation failed");
            throw error;
        }
    }
);
