import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { feedbacksubmit, getfeedback, updatefeedback } from "../../../NWconfig";

const getErrorMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.response?.data?.detail || fallback;

export const FeedbackSubmit = createAsyncThunk(
  "auth/FeedbackSubmit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(feedbacksubmit, data);

      return response.data;
    } catch (error) {
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

export const UpdateFeedback = createAsyncThunk(
  "UpdateFeedback",
  async ({ feedback_id, feedback }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${updatefeedback}${feedback_id}`,
        {
          feedback,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMsg(error));
    }
  }
);

export const DeleteFeedbackSubmit = createAsyncThunk(
  "DeleteFeedbackSubmit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/feedback/?feedback_id=${id}`
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
