import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  AskGemini,
  AskQuestionEndpoint,
  AskQuestionReportEndpoint,
  listGeneralInfoDoc,
  updateGenralDoc,
} from "../../NWconfig";

export const UploadGeneralDocSubmit = createAsyncThunk(
  "general/UploadGeneralDocSubmit",
  async ({ file, category }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await axiosInstance.post(
        `/admin_user_chat/upload?category=${encodeURIComponent(category)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const UpdateGeneralDocSubmit = createAsyncThunk(
  "general/UpdateGeneralDocSubmit",
  async ({ file_id, new_file, category }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", new_file);

      const response = await axiosInstance.patch(
        `${updateGenralDoc}?file_id=${file_id}&category=${encodeURIComponent(
          category
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const DeleteGeneralDocSubmit = createAsyncThunk(
  "general/DeleteGeneralDocSubmit",
  async ({ file_id, category }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/admin_user_chat/delete?category=${encodeURIComponent(category)}`,
        { params: { file_id } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const GeneralInfoSubmit = createAsyncThunk(
  "general/GeneralInfoSubmit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(listGeneralInfoDoc);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const AskQuestionGeneralAPI = createAsyncThunk(
  "chat/AskQuestionGeneralAPI",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AskQuestionEndpoint, Data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Question not sent"
      );
    }
  }
);

export const AskQuestionGeminiAPI = createAsyncThunk(
  "chat/AskQuestionGeminiAPI",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AskGemini, Data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Question not sent"
      );
    }
  }
);

export const AskQuestionReportAPI = createAsyncThunk(
  "chat/AskQuestionGeneralAPI",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        AskQuestionReportEndpoint,
        Data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Question not sent"
      );
    }
  }
);
