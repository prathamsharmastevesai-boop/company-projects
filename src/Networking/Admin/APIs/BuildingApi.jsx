import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosInstance";
import {
  CreateBuilding,
  DeleteBuildingEndpoint,
  ListBuilding,
  UpdateBuildingEndpoint,
} from "../../NWconfig";

export const CreateBuildingSubmit = createAsyncThunk(
  "auth/CreateBuildingSubmit",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(CreateBuilding, credentials);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const ListBuildingSubmit = createAsyncThunk(
  "auth/ListBuildingSubmit",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ListBuilding);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const UpdateBuildingSubmit = createAsyncThunk(
  "auth/UpdateBuildingSubmit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(UpdateBuildingEndpoint, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const DeleteBuilding = createAsyncThunk(
  "auth/DeleteBuilding",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${DeleteBuildingEndpoint}?building_id=${id}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
