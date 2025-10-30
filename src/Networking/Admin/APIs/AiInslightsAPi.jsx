import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosInstance";
import {
  ActivitySummary,
  AIAnalyticsData,
  AIInsights,
  RecentQuestion,
  UsageTreads,
} from "../../NWconfig";

export const getAnalyticApi = createAsyncThunk(
  "getAnalyticApi",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(AIAnalyticsData, {
        params: Data,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getInslightApi = createAsyncThunk(
  "getInslightApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(AIInsights);
      if (response.data?.message) toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getRecentQuestionApi = createAsyncThunk(
  "getRecentQuestionApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(RecentQuestion);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getUsageTreadApi = createAsyncThunk(
  "getUsageTreadApi",
  async (days, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(UsageTreads, { params: days });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getActivitySummaryApi = createAsyncThunk(
  "getActivitySummaryApi",
  async (days, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ActivitySummary, {
        params: { days },
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
