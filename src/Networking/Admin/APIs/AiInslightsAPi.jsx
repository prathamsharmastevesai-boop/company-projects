import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ActivitySummary, AIAnalyticsData, AIInsights, baseURL, RecentQuestion, UsageTreads } from "../../NWconfig";

export const getAnalyticApi = createAsyncThunk(
  "getAnalyticApi",
  async (Data) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${AIAnalyticsData}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        params: Data,
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } 
      else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage = message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage = message || "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = message || "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage = message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
      else {
        const errMsg = message || "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
  }
);

export const getInslightApi = createAsyncThunk(
  "getInslightApi",
  async (_, thunkAPI) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${AIInsights}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.message) {
        toast.success(response.data.message);
      }

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } 
      else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage = message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage = message || "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = message || "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage = message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
      else {
        const errMsg = message || "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
  }
);

export const getRecentQuestionApi = createAsyncThunk(
  "getRecentQuestionApi",
  async () => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${RecentQuestion}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } 
      else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage = message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage = message || "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = message || "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage = message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
      else {
        const errMsg = message || "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
  }
);

export const getUsageTreadApi = createAsyncThunk(
  "getUsageTreadApi",
  async (days) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${UsageTreads}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        params: days
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } 
      else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage = message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage = message || "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = message || "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage = message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
      else {
        const errMsg = message || "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
  }
);

export const getActivitySummaryApi = createAsyncThunk(
  "getActivitySummaryApi",
  async (days) => {
    const token = sessionStorage.getItem("token");

    try {
      const url = `${baseURL}${ActivitySummary}`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        params: { days },
      });

      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.response?.data?.message;

      console.log(status, "error.");

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("tokenExpiry");
        window.location.href = "/";
        return rejectWithValue("Session expired");
      } 
      else if ([400, 403, 404, 409].includes(status)) {
        let errorMessage = "An error occurred. Please try again.";
        switch (status) {
          case 400:
            errorMessage = message || "Bad Request. Please check the input and try again.";
            break;
          case 403:
            errorMessage = message || "Forbidden. You do not have permission to access this resource.";
            break;
          case 404:
            errorMessage = message || "Not Found. The requested resource could not be found.";
            break;
          case 409:
            errorMessage = message || "Conflict. There was a conflict with your request.";
            break;
        }
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
      else {
        const errMsg = message || "An internal server error occurred. Please try again later.";
        toast.error(errMsg);
        return rejectWithValue(errMsg);
      }
    }
  }
);

