import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddnewEmailTemplate,
  AddnewTenent,
  EmailDraftingTemlate,
  GenerateTemplate,
  TenentName,
} from "../../../NWconfig";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";

export const newTenentAPI = createAsyncThunk(
  "newTenentAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AddnewTenent, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const newEmailTemplateAPI = createAsyncThunk(
  "newEmailTemplateAPI",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(AddnewEmailTemplate, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const generateTemplate = createAsyncThunk(
  "generateTemplate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        GenerateTemplate,
        {},
        { params: data }
      );
      return response.data;
    } catch (error) {
      return handleApiError
        ? handleApiError(error, rejectWithValue)
        : rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const tenentNameList = createAsyncThunk(
  "tenentNameList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(TenentName);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const emailDraftingList = createAsyncThunk(
  "emailDraftingList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(EmailDraftingTemlate);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);
