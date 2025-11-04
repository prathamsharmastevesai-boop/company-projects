import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { inviteAdmin, listAdmin } from "../NWconfig";
import axiosInstance from "../Admin/APIs/AxiosInstance";

export const inviteAdminApi = createAsyncThunk(
  "inviteAdminApi",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(inviteAdmin, credentials);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getAdminlistApi = createAsyncThunk(
  "getAdminlistApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(listAdmin);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
