import { api } from "../instance";

export interface IGetNgduListTablesResponse
  extends IResponse<{
    ngdu: IObject[];
    mest: IObject[];
    cdng: IObject[];
    obj: IObject[];
    plast: IObject[];
    kust: IObject[];
    well: IObject[];
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
