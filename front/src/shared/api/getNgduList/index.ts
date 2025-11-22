import { api } from "../instance";

interface IGetNgduListResponse extends IResponse<IBaseObject[]> {}

export interface IGetNgduListParams {
  query: string | null;
}

export const getNgduList = async (params: IGetNgduListParams) =>
  api.get<IGetNgduListResponse>("/ngdu/list", { params });
