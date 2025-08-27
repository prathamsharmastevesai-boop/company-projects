import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Approved_list, baseURL, Denied_list, Request_approve_deny, Request_list, } from '../../NWconfig';


export const ListRequestSubmit = createAsyncThunk(
    'auth/ListRequestSubmit',
    async () => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${Request_list}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            console.log(response, "response");

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
);

export const Request_Approved_Deny_Submit = createAsyncThunk(
    'auth/Request_Approved_Deny_Submit',
    async (data) => {

        const token = sessionStorage.getItem('token');

        try {
            const url = `${baseURL}${Request_approve_deny}`;
            console.log(url, "url");

            const response = await axios.patch(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                },
            });
            console.log(url, "url");
            console.log(response, "response");
            toast.success(response.data.message)
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Building Updation failed");
            throw error;
        }
    }
);

export const Approved_list_submit = createAsyncThunk(
    'auth/Approved_list_submit',
    async () => {
        const token = sessionStorage.getItem('token');
        try {
            const url = `${baseURL}${Approved_list}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            console.log(response, "response");

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
);

export const Denied_list_submit = createAsyncThunk(
    'auth/Denied_list_submit',
    async () => {
        const token = sessionStorage.getItem('token');
        try {
            const url = `${baseURL}${Denied_list}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            console.log(response, "response");

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
);

