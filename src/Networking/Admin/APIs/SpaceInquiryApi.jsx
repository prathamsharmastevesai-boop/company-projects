import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import { CreateBuilding, ingestionconfigs } from "../../NWconfig";

export const IngestionConfigsSubmit = createAsyncThunk(
  "IngestionConfigsSubmit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ingestionconfigs, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
