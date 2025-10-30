import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./AxiosInstance";
import { toast } from "react-toastify";
import { InviteUser, userList } from "../../NWconfig";

export const inviteUserApi = createAsyncThunk(
  "auth/inviteUserApi",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(InviteUser, credentials);
      toast.success(response.data?.message || "User invited successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to invite user"
      );
    }
  }
);

export const getUserlistApi = createAsyncThunk(
  "auth/getUserlistApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(userList);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user list"
      );
    }
  }
);
