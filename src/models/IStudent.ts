import type { ICurriculum } from "./ICurriculum";

export interface IStudent {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  institutionalEmail: string;
  identificationNumber: string;
  isActive: boolean;
  curriculum?: ICurriculum; 
}