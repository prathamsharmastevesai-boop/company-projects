import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { feedbacksubmit, getfeedback } from "../../../NWconfig";

const getErrorMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.response?.data?.detail || fallback;

export const FeedbackSubmit = createAsyncThunk(
  "auth/FeedbackSubmit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(feedbacksubmit, data);
      toast.success("Thank you for your valuable feedback!");
      return response.data;
    } catch (error) {
      toast.error(getErrorMsg(error));
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const GetFeedbackList = createAsyncThunk(
  "auth/GetFeedbackList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getfeedback);
      return response.data;
    } catch (error) {
      toast.error(getErrorMsg(error));
      return rejectWithValue(getErrorMsg(error));
    }
  }
);
