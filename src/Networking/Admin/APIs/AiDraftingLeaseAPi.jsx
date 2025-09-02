import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL,deleteDraftingDoc,listDraftingDoc,upload_Drafting_Lease,UploadDoc } from '../../NWconfig';

export const UploadDraftingLeaseDoc = createAsyncThunk(
  '/UploadDraftingLeaseDoc',
  async ({ file, category }, { rejectWithValue }) => {
    console.log({ file, category }, "Uploading document...");

    const token = sessionStorage.getItem('token');
    const url = `${baseURL}${upload_Drafting_Lease}`;

    try {
      const formData = new FormData();
      formData.append("file", file);  
      formData.append("category", category.toLowerCase());

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

export const ListDraftingLeaseDoc = createAsyncThunk(
  'ListDraftingLeaseDoc',
  async ({ category }) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${listDraftingDoc}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        params: {
          category,
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


export const DeleteDrafingDoc = createAsyncThunk(
  'DeleteDrafingDoc',
  async (id) => {
    console.log(id, "id");
const file_id =id.fileId
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${deleteDraftingDoc}?file_id=${file_id}`;
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