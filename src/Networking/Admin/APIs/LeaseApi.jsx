import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, CreateLeaseEndpoint, DeleteLeaseEndpoint, LeaselistEndpoint, UpdateLeaseeEndpoint } from '../../NWconfig'; 


export const CreateLeaseSubmit = createAsyncThunk(
    'auth/CreateLeaseSubmit',
    async (credentials) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${CreateLeaseEndpoint}`;
            const response = await axios.post(url, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
             toast.success(response.data.message)
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Lease creation failed");
            throw error;
        }
    }
);

export const ListLeaseSubmit = createAsyncThunk(
    'auth/ListLeaseSubmit',
    async (id) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${LeaselistEndpoint}?building_id=${id}`;

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

export const UpdateLeaseSubmit = createAsyncThunk(
  "admin/UpdateLeaseSubmit",
  async (formData, thunkAPI) => {
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.patch(`${baseURL}${UpdateLeaseeEndpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
      });

      toast.success(response.data.message);
      
      return response.data;
    } catch (error) {
      console.log(error,"error");
      
      toast.error(error.response?.data?.message || "Failed to update Lease");
      throw error;
    }
  }
);

export const DeleteLease = createAsyncThunk(
  'auth/DeleteLease',
  async (id) => {
    console.log(id,"id");
    
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${DeleteLeaseEndpoint}?lease_id=${id.lease_id}&building_id=${id.building_id}`;
      console.log(url, "url");

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
toast.success(response.data.message)
      console.log(response, "response");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Lease deletion failed");
      throw error;
    }
  }
);