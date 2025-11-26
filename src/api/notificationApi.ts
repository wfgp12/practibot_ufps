import axiosClient from "./axiosClient";

export const notificationApi = {
  // GET /api/notificaciones
  getMyNotifications: (params?: {
    tipo?: string;
    leida?: boolean;
    prioridad?: string;
    page?: number;
    limit?: number;
  }) => {
    return axiosClient.get("/notificaciones", { params });
  },

  // GET /api/notificaciones/no-leidas/conteo
  getUnreadCount: () => {
    return axiosClient.get("/notificaciones/no-leidas/conteo");
  },

  // PATCH /api/notificaciones/:id/leer
  markAsRead: (id: number) => {
    return axiosClient.patch(`/notificaciones/${id}/leer`);
  },

  // PATCH /api/notificaciones/leer-todas
  markAllAsRead: () => {
    return axiosClient.patch("/notificaciones/leer-todas");
  },

  // DELETE /api/notificaciones/:id
  deleteNotification: (id: number) => {
    return axiosClient.delete(`/notificaciones/${id}`);
  },

  // POST /api/notificaciones/verificar-convenios
  runManualConvenioCheck: () => {
    return axiosClient.post("/notificaciones/verificar-convenios");
  },
};
