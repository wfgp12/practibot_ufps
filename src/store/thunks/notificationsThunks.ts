import { createAsyncThunk } from "@reduxjs/toolkit";
import { notificationApi } from "@/api/notificationApi";

export const loadNotificationsThunk = createAsyncThunk(
    "notifications/load",
    async (_, { rejectWithValue }) => {
        try {
            const res = await notificationApi.getMyNotifications();

            return res.data.data; 
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue("Error inesperado");
        }
    }
);
