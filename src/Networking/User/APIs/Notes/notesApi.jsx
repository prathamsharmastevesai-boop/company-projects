import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Admin/APIs/AxiosInstance";
import { toast } from "react-toastify";

export const notes = "/notes/";

export const createNoteApi = createAsyncThunk(
  "notes/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(notes, data);
      toast.success(response.data?.message || "Note created!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getNotesApi = createAsyncThunk(
  "notes/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(notes);
      return response.data;
    } catch (error) {
      toast.error("Failed to load notes");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getNoteByIdApi = createAsyncThunk(
  "notes/getOne",
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${notes}${noteId}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to load note");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateNoteApi = createAsyncThunk(
  "notes/update",
  async ({ noteId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${notes}${noteId}`, data);
      toast.success("Note updated!");
      return response.data;
    } catch (error) {
      toast.error("Failed to update note");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteNoteApi = createAsyncThunk(
  "notes/delete",
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${notes}${noteId}`);
      toast.success("Note deleted!");
      return { noteId };
    } catch (error) {
      toast.error("Failed to delete note");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
