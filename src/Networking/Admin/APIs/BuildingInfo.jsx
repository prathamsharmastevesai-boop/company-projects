import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, Upload_General_info } from '../../NWconfig';

export const UploadBuildinginfoSubmit = createAsyncThunk(
    'auth/UploadBuildinginfoSubmit',
    async (credentials) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${Upload_General_info}`;
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success(response.data.message)
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Building creation failed");
            throw error;
        }
    }
);