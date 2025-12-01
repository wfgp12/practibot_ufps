import type { IApiResponse } from "@/models/IApi";
import axiosClient from "./axiosClient";

export interface ResumenReportes {
  estudiantesEnPractica: number;
  vacantesActivas: number;
  conveniosVigentes: number;
  conveniosPorVencer: number;
}

const reportsApi = {
  obtenerResumen: async (): Promise<ResumenReportes> => {
    const { data } = await axiosClient.get<IApiResponse<ResumenReportes>>("/reportes/resumen");

    console.log(data);
    return data.data;
  },
};

export default reportsApi;
