import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AskQuestion, baseURL, DeleteDoc, ListDoc, UpdateDoc, UploadDoc } from '../../NWconfig';


export const UploadDocSubmit = createAsyncThunk(
  '/UploadDocSubmit',
  async ({ files, buildingId, category }, { rejectWithValue }) => {

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}${UploadDoc}`;

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("building_id", buildingId);
      formData.append("category", category);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "multipart/form-data",
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

export const UpdateDocSubmit = createAsyncThunk(
  "auth/UpdateDocSubmit",
  async ({ file_id, new_file, building_id, category }, thunkAPI) => {
    const token = sessionStorage.getItem("token");
    const url = `${baseURL}${UpdateDoc}`;
    try {
      const formData = new FormData();

      formData.append("file_id", file_id);
      formData.append("new_file", new_file);
      formData.append("building_id", building_id);
      formData.append("category", category);

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      toast.success(response?.data?.message)
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

export const ListDocSubmit = createAsyncThunk(
  'auth/ListDocSubmit',
  async ({ building_id, category }) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${ListDoc}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        params: {
          building_id,
          category,
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

export const DeleteDocSubmit = createAsyncThunk(
  'documents/DeleteDoc',
  async ({ building_id, category, file_id }, thunkAPI) => {

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}${DeleteDoc}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        params: {
          building_id,
          category,
          file_id,
        },
      });

      toast.success(response?.data?.message);
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

export const AskQuestionAPI = createAsyncThunk(
  'auth/AskQuestionAPI',
  async (Data) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${AskQuestion}`;
      const response = await axios.post(url, Data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message)
      return response.data;
    }catch (error) {
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

