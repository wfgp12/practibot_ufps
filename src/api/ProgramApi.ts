import axiosClient from "./axiosClient";

export const ProgramApi = {
  // Obtener todos los programas (CRUD)
  getAll: async () => {
    const res = await axiosClient.get("/programas");
    return res.data;
  },

  // Endpoint PÚBLICO: solo id y nombre
  getSelectList: async () => {
    const res = await axiosClient.get("/programas/list/select");
    return res.data;
  },

  // Obtener un programa por ID
  getById: async (id: number) => {
    const res = await axiosClient.get(`/programas/${id}`);
    return res.data;
  },

  // Crear un programa
  create: async (data: { nombre: string; facultad: string }) => {
    const res = await axiosClient.post("/programas", data);
    return res.data;
  },

  // Editar un programa
  update: async (id: number, data: { nombre?: string; facultad?: string }) => {
    const res = await axiosClient.put(`/programas/${id}`, data);
    return res.data;
  },

  // Eliminar un programa
  delete: async (id: number) => {
    const res = await axiosClient.delete(`/programas/${id}`);
    return res.data;
  },
};

export default ProgramApi;
