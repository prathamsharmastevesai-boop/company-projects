import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import { getadminfeedback } from "../../NWconfig";

export const getadminfeedbacksubmit = createAsyncThunk(
  "auth/getadminfeedbacksubmit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getadminfeedback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
