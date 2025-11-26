import { io } from "socket.io-client";

export const createSocket = () => {
  return io(import.meta.env.VITE_WS_URL, {
    transports: ["websocket"],
    auth: {
      token: localStorage.getItem("token"),
    },
  });
};

export let socket = createSocket();

export const reconnectSocket = () => {
  socket.disconnect();
  socket = createSocket();
};
