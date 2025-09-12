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

export const DeleteLease = createAsyncThunk(
  'auth/DeleteLease',
  async (id) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${DeleteLeaseEndpoint}?lease_id=${id.lease_id}&building_id=${id.building_id}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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