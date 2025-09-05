import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AskGeneralDoc, baseURL, listGeneralInfoDoc, updateGenralDoc, UploadGeneralDoc, } from '../../NWconfig';


export const UploadGeneralDocSubmit = createAsyncThunk(
  '/UploadGeneralDocSubmit',
  async ({ file, category }, { rejectWithValue }) => {
    console.log({ file, category }, "Uploading document...");

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}/admin_user_chat/upload?category=${encodeURIComponent(category)}`;

    try {
      const formData = new FormData();
      formData.append("files", file);

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
      toast.error(error.response?.data?.message || error.message || "File upload failed");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const UpdateGeneralDocSubmit = createAsyncThunk(
  "general/UpdateGeneralDocSubmit",
  async ({ file_id, new_file, category }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const url = `${baseURL}${updateGenralDoc}?file_id=${file_id}&category=${encodeURIComponent(category)}`;

      const formData = new FormData();
      formData.append("file", new_file);

      const response = await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response?.data?.message || "File updated successfully");
      return response.data;
    } catch (error) {
      console.error("File update error:", error);
      toast.error(error.response?.data?.message || error.message || "Update failed");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const DeleteGeneralDocSubmit = createAsyncThunk(
  'DeleteGeneralDocSubmit',
  async ({ file_id, category }, { rejectWithValue }) => {
    console.log({ file_id, category }, "Deleting file...");

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}/admin_user_chat/delete?category=${encodeURIComponent(category)}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        params: {
          file_id,
        },
      });

      toast.success(response?.data?.message);
      return response.data;

    } catch (error) {
      const errorMsg = error.response?.data?.message || "File deletion failed.";
      toast.error(errorMsg);
      console.error("Delete error:", errorMsg);
      return rejectWithValue(error.response?.data || errorMsg);
    }
  }
);

export const GeneralInfoSubmit = createAsyncThunk(
  'auth/GeneralInfoSubmit',
  async () => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${listGeneralInfoDoc}`;

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

export const AskQuestionGeneralAPI = createAsyncThunk(
  "chat/AskQuestionGeneralAPI",
  async (Data, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(`${baseURL}${AskGeneralDoc}`, Data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Question not sent";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);