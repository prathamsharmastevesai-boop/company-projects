import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, InviteUser, userList } from '../../NWconfig';

export const inviteUserApi = createAsyncThunk(
    'inviteUserApi',
    async (credentials) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${InviteUser}`;
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
            toast.error(error.response?.data?.message || "Lease creation failed");
            throw error;
        }
    }
);

export const getUserlistApi = createAsyncThunk(
    'getUserlistApi',
    async () => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${userList}`;

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