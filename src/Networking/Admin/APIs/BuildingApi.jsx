import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, CreateBuilding, DeleteBuildingEndpoint, ListBuilding, UpdateBuildingEndpoint } from '../../NWconfig';

export const CreateBuildingSubmit = createAsyncThunk(
  'auth/CreateBuildingSubmit',
  async (credentials) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${CreateBuilding}`;
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

export const ListBuildingSubmit = createAsyncThunk(
  'auth/ListBuildingSubmit',
  async (thunkAPI) => {
    const token = sessionStorage.getItem('token');
    try {

      const url = `${baseURL}${ListBuilding}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
      throw error;
    }
  }
);

export const UpdateBuildingSubmit = createAsyncThunk(
  'auth/UpdateBuildingSubmit',
  async (data) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${UpdateBuildingEndpoint}`;
      console.log(url, "url");

      const response = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log(url, "url");
      console.log(response, "response");
      toast.success(response.data.message)
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Building Updation failed");
      throw error;
    }
  }
);

export const DeleteBuilding = createAsyncThunk(
  'auth/DeleteBuilding',
  async (id) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${DeleteBuildingEndpoint}?building_id=${id}`;
      console.log(url, "DELETE Building URL");

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
      toast.error(error.response?.data?.message || "Building deletion failed");
      throw error;
    }
  }
);

