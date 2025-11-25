import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
      state.items.unshift(action.payload);
      state.unreadCount++;
    },
    markAsRead(state, action: PayloadAction<number>) {
      state.items = state.items.map(n =>
        n.id === action.payload ? { ...n, leida: true } : n
      );
      state.unreadCount = state.items.filter(n => !n.leida).length;
    },
  },
});

export const { setNotifications, addNotification, markAsRead } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
