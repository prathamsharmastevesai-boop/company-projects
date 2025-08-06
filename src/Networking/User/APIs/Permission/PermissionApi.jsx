import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, Request_permission } from '../../../NWconfig';

export const RequestPermissionSubmit = createAsyncThunk(
  '/RequestPermissionSubmit',
  async (data, { rejectWithValue }) => {

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}${Request_permission}`;

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      toast.success(response.data.message);
      return response.data;

    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || error.message||"Request Permission failed");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);