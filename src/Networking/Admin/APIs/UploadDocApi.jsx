import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AskQuestion, baseURL, DeleteDoc, ListDoc, UpdateDoc, UploadDoc } from '../../NWconfig';


export const UploadDocSubmit = createAsyncThunk(
  '/UploadDocSubmit',
  async ({ files, buildingId, lease_id }, { rejectWithValue }) => {
    console.log({ files, buildingId, lease_id }, "Uploading documents...");

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}${UploadDoc}`;

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("building_id", buildingId);
      formData.append("lease_id", lease_id);

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
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || error.message||"File upload failed");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const UpdateDocSubmit = createAsyncThunk(
  "auth/UpdateDocSubmit",
  async ({ file_id, new_file, building_id, lease_id }, thunkAPI) => {
    console.log({ file_id, new_file, building_id, lease_id }, "file_id, new_file, buildingId, lease_id ");

    const token = sessionStorage.getItem("token");
    const url = `${baseURL}${UpdateDoc}`;
    try {
      const formData = new FormData();

      // Append required fields
      formData.append("file_id", file_id);
      formData.append("new_file", new_file);
      formData.append("building_id", building_id);
      formData.append("lease_id", lease_id);

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log(response, "response in api");
      toast.success(response?.data?.message)
      return response.data;
    } catch (error) {
      console.error("File update error:", error);
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message)
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const ListDocSubmit = createAsyncThunk(
  'auth/ListDocSubmit',
  async ({ building_id, lease_id }) => {
    console.log("building_id:", building_id, "lease_id:", lease_id);

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
          lease_id,
        },
      });

      console.log(response.data, "data in api");
      return response.data;
    } catch (error) {
      console.error("ListDocSubmit error:", error);
      toast.error(error.response?.data?.message || "Document listing failed");
      throw error;
    }
  }
);

export const DeleteDocSubmit = createAsyncThunk(
  'documents/DeleteDoc',
  async ({ building_id, lease_id, file_id }, thunkAPI) => {
    console.log({ building_id, lease_id, file_id }, "Deleting file...");

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
          lease_id,
          file_id,
        },
      });

      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "File deletion failed.";
      toast.error(errorMsg);
      console.error("Delete error:", errorMsg);
      return thunkAPI.rejectWithValue(error.response?.data);
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
      console.log(response.data, "response");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Question Not sended");
      throw error;
    }
  }
);

