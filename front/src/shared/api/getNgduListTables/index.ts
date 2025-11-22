import { api } from "../instance";

export interface IGetNgduListTablesResponse
  extends IResponse<{
    ngdu: IBaseObject[];
    mest: IBaseObject[];
    cdng: IBaseObject[];
    obj: IBaseObject[];
    plast: IBaseObject[];
    kust: IBaseObject[];
    well: IBaseObject[];
  }> {}

export interface IGetNgduListTablesParams {
  query: string | null;
}

export const getNgduListTables = async (params: IGetNgduListTablesParams) =>
  api.get<IGetNgduListTablesResponse>("/ngdu/list/tables", {
    params: {
      query: params.query || 1
    }
  });
