import { api } from "../instance";

interface IGetNgduListResponse extends ICdng {}

export interface IGetNgduListParams {
  query: string;
}

export const getNgduList = async (params: IGetNgduListParams) =>
  api.get<IGetNgduListResponse[]>("/ngdu/list", { params });
