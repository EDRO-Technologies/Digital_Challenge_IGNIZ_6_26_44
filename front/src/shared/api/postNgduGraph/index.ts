import { api } from "../instance";

interface IPostNgduGraphResponse
  extends IResponse<{
    nodes: INode[];
    links: ILink[];
  }> {}

export interface IPostNgduGraphParams {
  topology: ITopology;
  type: IObjectType;
  id: number;
}

export const postNgduGraph = async (dto: IPostNgduGraphParams) =>
  api.post<IPostNgduGraphResponse>("/ngdu/graph", dto);
