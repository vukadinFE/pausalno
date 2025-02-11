import { DATA_PATH, STATE_PATH } from "~/consts";

export const dataStorage = (company: string) =>
  `${DATA_PATH}/${companyName(company)}`;
export const stateStorage = (company: string, month: number) =>
  `${STATE_PATH}/${companyName(company)}/${month}`;
