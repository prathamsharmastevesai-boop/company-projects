import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import {
  Doc_Delete_Specific,
  List_specific_Docs,
  Session_List_Specific,
  Upload_specific_file,
  Del_Chat_Session,
  Chat_history,
} from "../../../NWconfig";

const getErrorMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.response?.data?.detail || fallback;

export const Upload_specific_file_Api = createAsyncThunk(
  "auth/Upload_specific_file_Api",
  async ({ files, category }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("category", category);

      const response = await axiosInstance.post(
        Upload_specific_file,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message || "File uploaded successfully");
      return response.data;
    } catch (error) {
      toast.error(getErrorMsg(error));
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const get_specific_Doclist_Api = createAsyncThunk(
  "auth/get_specific_Doclist_Api",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(List_specific_Docs);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const get_Session_List_Specific = createAsyncThunk(
  "auth/get_Session_List_Specific",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(Session_List_Specific);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const Delete_Doc_Specific = createAsyncThunk(
  "auth/Delete_Doc_Specific",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${Doc_Delete_Specific}?file_id=${id}`
      );
      toast.success(response.data.message || "Document deleted successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const Delete_Chat_Session = createAsyncThunk(
  "auth/Delete_Chat_Session",
  async (id, { rejectWithValue }) => {
    try {
      const url = `${Del_Chat_Session}?session_id=${id}`;
      const response = await axiosInstance.delete(url);

      return response.data;
    } catch (error) {
      console.error("Delete_Chat_Session error:", error);

      const status = error.response?.status;
      const message =
        error.response?.data?.detail || error.response?.data?.message;

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.clear();
        window.location.href = "/";
        return rejectWithValue("Session expired");
      }

      const errorMessage =
        message ||
        "An unexpected error occurred while deleting the chat session.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const get_Chat_History = createAsyncThunk(
  "auth/get_Chat_History",
  async (session_id, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${Chat_history}?session_id=${session_id}`;
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });

      return response.data;
    } catch (error) {
      console.error("get_Chat_History error:", error);

      const status = error.response?.status;
      const message =
        error.response?.data?.detail || error.response?.data?.message;

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.clear();
        window.location.href = "/";
        return rejectWithValue("Session expired");
      }

      const errorMessage =
        message || "Failed to fetch chat history. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
