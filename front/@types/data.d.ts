type ITopology = "organizational" | "geology";

type IObjectType = "cdng" | "kust" | "mest" | "ngdu" | "obj" | "plast" | "well";

interface INode {
  id: number;
  name: string;
  type: IObjectType;
}

interface ILink {
  sourceId: number;
  targetId: number;
}

interface IResponse<T> {
  message: T;
  statusCode: number;
}

interface IBaseObject {
  id: number;
  name: string;
}

interface IObject extends IBaseObject {
  type: string;
}
