/** Estructura base para todas las respuestas del backend */
export interface IApiResponse<T> {
  message?: string;
  data: T;
}

/** Estructura estándar para respuestas paginadas */
export interface IApiPaginatedResponse<T> {
  message?: string;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
