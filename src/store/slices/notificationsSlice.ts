import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadNotificationsThunk } from "../thunks/notificationsThunks";

export interface NotificationApi {
    id: number;
    titulo: string;
    mensaje: string;
    leida: boolean;
    creadaEn: string;
}
export interface Notification {
    id: number;
    titulo: string;
    mensaje: string;
    leida: boolean;
    fecha: string;
}

interface State {
    items: Notification[];
    unreadCount: number;
}

const initialState: State = {
    items: [],
    unreadCount: 0,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<Notification[]>) {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.leida).length;
        },
        addNotification(state, action: PayloadAction<Notification>) {
            state.items = state.items.filter(n => n.id !== action.payload.id);
            state.items.unshift(action.payload);
            if (!action.payload.leida) state.unreadCount++;
        },
        markAsRead(state, action: PayloadAction<number>) {
            state.items = state.items.map(n =>
                n.id === action.payload ? { ...n, leida: true } : n
            );
            state.unreadCount = state.items.filter(n => !n.leida).length;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadNotificationsThunk.fulfilled, (state, action: PayloadAction<NotificationApi[]>) => {
            const mapped = action.payload.map((n) => ({
                id: n.id,
                titulo: n.titulo,
                mensaje: n.mensaje,
                leida: n.leida,
                fecha: n.creadaEn, // <--- ajustar aquí
            }));
            state.items = mapped;
            state.unreadCount = mapped.filter(n => !n.leida).length;
        });
    }
});

export const { setNotifications, addNotification, markAsRead } =
    notificationsSlice.actions;

export default notificationsSlice.reducer;
