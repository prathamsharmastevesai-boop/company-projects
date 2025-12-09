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
  async ({ file, category, building_Id }, { rejectWithValue }) => {
    console.log(building_Id, file, "building_Idsdgsdgdfsg");

    try {
      const formData = new FormData();
      formData.append("files", file);

      let url = `/admin_user_chat/upload?category=${encodeURIComponent(
        category
      )}`;

      if (building_Id) {
        url += `&building_id=${building_Id}`;
      }

      const response = await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
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
  async ({ buildingId, category }, { rejectWithValue }) => {
    try {
      let response;

      if (buildingId) {
        response = await axiosInstance.get(
          `/chatbot/files/?building_id=${buildingId}&category=${category}`
        );
      } else {
        response = await axiosInstance.get(
          `/chatbot/files/?category=${category}`
        );
      }

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
