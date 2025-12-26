import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { ProfileDetail, ProfileUpdateDetail } from "../../../NWconfig";

const getErrorMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.response?.data?.detail || fallback;

export const getProfileDetail = createAsyncThunk(
  "auth/getProfileDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ProfileDetail);
      return response.data;
    } catch (error) {
      const msg = getErrorMsg(error);
      // toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const ProfileUpdateApi = createAsyncThunk(
  "auth/ProfileUpdateApi",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(ProfileUpdateDetail, formData);
      toast.success(response.data?.message || "Profile updated successfully!");
      return response.data;
    } catch (error) {
      const msg = getErrorMsg(error);
      return rejectWithValue(msg);
    }
  }
);
