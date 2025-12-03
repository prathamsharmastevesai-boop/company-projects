import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { toast } from "react-toastify";
import { calcEndpoint } from "../../../NWconfig";

export const calcSubmitApi = createAsyncThunk(
  "calcSubmitApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(calcEndpoint, data);
      toast.success(response.data?.message || "Calculation successful!");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to calculate"
      );
    }
  }
);
