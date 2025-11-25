import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAppDispatch } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationsSlice";
import type { Notification } from "@/store/slices/notificationsSlice";

export const useNotificationsSocket = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        socket.on("notification", (data: Notification) => {
            dispatch(addNotification(data));
        });

        return () => {
            socket.off("notification");
        };
    }, []);
};
