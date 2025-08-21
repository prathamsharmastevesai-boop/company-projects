import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AskQuestion_Specific, baseURL, Chat_history, Chat_history_Specific, Del_Chat_Session, Doc_Delete_Specific, List_specific_Docs, Old_history, Session_Delete_Specific, Session_List_Specific, Upload_specific_file } from '../../../NWconfig';

//chat with document
export const getlist_his_oldApi = createAsyncThunk(
  'auth/getlist_his_oldApi',
  async () => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${Old_history}`;

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

export const get_chathistory_Api = createAsyncThunk(
  'auth/get_chathistory_Api',
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${Chat_history}?session_id=${id}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch chat history");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const Delete_Chat_Session = createAsyncThunk(
  'auth/Delete_Chat_Session',
  async (id) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${Del_Chat_Session}delete/?session_id=${id}`;
      console.log(url, "DELETE Building URL");

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      toast.success(response.data.message || "Building Session successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);


//Chat with Specific Document

export const Upload_specific_file_Api = createAsyncThunk(
  'auth/Upload_specific_file_Api',
  async ({ files }, thunkAPI) => {
    const token = sessionStorage.getItem('token');
    const url = `${baseURL}${Upload_specific_file}`;

    try {
      const formData = new FormData();

      // Append multiple files
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "File upload failed");
      throw error;
    }
  }
);


export const get_specific_Doclist_Api = createAsyncThunk(
  'auth/get_specific_Doclist_Api',
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${List_specific_Docs}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Document list");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const AskQuestion_Specific_API = createAsyncThunk(
  'AskQuestion_Specific_API',
  async (Data) => {

    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${AskQuestion_Specific}`;
      const response = await axios.post(url, Data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(response.data.message)
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message );
      throw error;
    }
  }
);


export const get_Session_List_Specific = createAsyncThunk(
  'get_Session_List_Specific',
  async () => {

    const token = sessionStorage.getItem('token');

    try {
      console.log("console in api ");
      
      const url = `${baseURL}${Session_List_Specific}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
console.log(response.data,"response.data23242323423");

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);


export const get_chathistory_Specific_Api = createAsyncThunk(
  'auth/get_chathistory_Specific_Api',
  async (id, { rejectWithValue }) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${Chat_history_Specific}?session_id=${id}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch chat history");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const Delete_Chat_Specific_Session = createAsyncThunk(
  'auth/Delete_Chat_Specific_Session',
  async (id) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${Session_Delete_Specific}?session_id=${id}`;
      console.log(url, "DELETE Building URL");

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      toast.success(response.data.message || "Building Session successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);

export const Delete_Doc_Specific = createAsyncThunk(
  'auth/Delete_Doc_Specific',
  async (id) => {
    const token = sessionStorage.getItem('token');

    try {
      const url = `${baseURL}${Doc_Delete_Specific}?file_id=${id}`;
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
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);