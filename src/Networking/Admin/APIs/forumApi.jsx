import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import {
  createThoughtEndpoint,
  createThreadEndpoint,
  threadData,
  ThreadhistoryEndpoint,
} from "../../NWconfig";

export const get_Threads_Api = createAsyncThunk(
  "get_Threads_Api",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(threadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
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

export const createThoughtApi = async ({ thread_id, content }) => {
  try {
    const response = await axiosInstance.post(
      `/forum/threads/${thread_id}/thoughts`,
      { content }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getThreadhistory = createAsyncThunk(
  "getThreadhistory",
  async (thread_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/forum/threads/${thread_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);
