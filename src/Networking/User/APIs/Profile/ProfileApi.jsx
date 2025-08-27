import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, ProfileDetail, ProfileUpdateDetail } from '../../../NWconfig';


export const getProfileDetail = createAsyncThunk(
    'auth/getProfileDetail',
    async () => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${ProfileDetail}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
);

export const ProfileUpdateApi = createAsyncThunk(
    'auth/ProfileUpdateApi',
    async (formdata) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${ProfileUpdateDetail}`;

            const response = await axios.patch(url, formdata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
            });

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
);

