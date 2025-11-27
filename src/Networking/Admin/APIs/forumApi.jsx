import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import { createThreadEndpoint, threadData } from "../../NWconfig";
import { toast } from "react-toastify";

export const get_Threads_Api = createAsyncThunk(
  "get_Threads_Api",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(threadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createThread = createAsyncThunk(
  "threads/createThread",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(createThreadEndpoint, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteThreadsApi = createAsyncThunk(
  "deleteThreadsApi",
  async ({ thread_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/forum/threads/${thread_id}`
      );
      return { thread_id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createThoughtApi = createAsyncThunk(
  "forum/createThoughtApi",
  async ({ thread_id, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/forum/threads/${thread_id}/thoughts`,
        { content }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateThoughtApi = createAsyncThunk(
  "updateThoughtApi",
  async ({ thread_id, thought_id, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/forum/threads/${thread_id}/thoughts/${thought_id}`,
        { content }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getThreadhistory = createAsyncThunk(
  "getThreadhistory",
  async (thread_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/forum/threads/${thread_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteThoughtApi = createAsyncThunk(
  "deleteThoughtApi",
  async ({ thread_id, thought_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/forum/threads/${thread_id}/thoughts/${thought_id}`
      );
      return { thread_id, thought_id };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBenchmark = createAsyncThunk(
  "det/getBenchmark",
  async ({ sf_band, submarket, building_class }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/det_expense/benchmark`, {
        params: {
          sf_band,
          submarket,
          building_class,
        },
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch benchmark"
      );
    }
  }
);
