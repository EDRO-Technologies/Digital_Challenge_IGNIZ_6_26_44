interface ICdng {
  id: number;
  name: string;
}

interface IResponse<T> {
  message: T;
  statusCode: number;
}
