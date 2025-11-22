import type { TTarget, TTopology } from '../types/ngdu.types';

class DefaultRequest {
  type: TTarget;
  id: number;
}

export class GetGraphRequest extends DefaultRequest {
  topology: TTopology;
}

export class PostObjectExistsRequest extends DefaultRequest {}

export class PostObjectNameRequest extends DefaultRequest {}

export class PostIsConnectedRequest {
  source: DefaultRequest;
  target: DefaultRequest;
}
