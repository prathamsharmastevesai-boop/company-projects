import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, inviteAdmin, listAdmin } from '../NWconfig';

export const inviteAdminApi = createAsyncThunk(
    'inviteAdminApi',
    async (credentials) => {
console.log(credentials);

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${inviteAdmin}`;
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data, "response.data");

            toast.success(response.data.message)
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
);

export const getAdminlistApi = createAsyncThunk(
    'getAdminlistApi',
    async () => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${listAdmin}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message );
            throw error;
        }
    }
);