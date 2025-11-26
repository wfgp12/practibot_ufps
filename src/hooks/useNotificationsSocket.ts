import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAppDispatch } from "@/store/hooks";
import { addNotification, markAsRead } from "@/store/slices/notificationsSlice";
import type { NotificationApi } from "@/store/slices/notificationsSlice";

export const useNotificationsSocket = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleNew = (data: NotificationApi) => {
           dispatch(addNotification({
                id: data.id,
                titulo: data.titulo,
                mensaje: data.mensaje,
                leida: data.leida,
                fecha: data.creadaEn, 
            }));
        };

        const handleUpdate = (data: { id: number; leida: boolean }) => {
            dispatch(markAsRead(data.id));
        };

        socket.on("nueva-notificacion", handleNew);
        socket.on("notification-updated", handleUpdate);

        return () => {
            socket.off("nueva-notificacion", handleNew);
            socket.off("notification-updated", handleUpdate);
        };
    }, [dispatch]);
};
