import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ActivitySummary, AIAnalyticsData, AIInsights, baseURL, RecentQuestion, UsageTreads } from "../../NWconfig";

export const getAnalyticApi = createAsyncThunk(
  "getAnalyticApi",
  async (Data) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${AIAnalyticsData}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        params: Data,
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);

export const getInslightApi = createAsyncThunk(
  "getInslightApi",
  async (_, thunkAPI) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${AIInsights}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      // Optional: Only show toast if API explicitly sends a message
      if (response.data?.message) {
        toast.success(response.data.message);
      }

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch AI Insights";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const getRecentQuestionApi = createAsyncThunk(
  "getRecentQuestionApi",
  async () => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${RecentQuestion}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);

export const getUsageTreadApi = createAsyncThunk(
  "getUsageTreadApi",
  async (days) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${UsageTreads}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        params: days
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);

export const getActivitySummaryApi = createAsyncThunk(
  "getActivitySummaryApi",
  async (days) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${ActivitySummary}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        params: { days },
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      throw error;
    }
  }
);

