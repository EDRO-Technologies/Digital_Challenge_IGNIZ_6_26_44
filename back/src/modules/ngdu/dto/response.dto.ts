import type { Links, Node } from './ngdu.types';

export class GetGraphResponse {
  nodes: Node[];
  links: Links[];
}

export class PostObjectExistsResponse {
  exists: boolean;
}

export class PostObjectNameResponse {
  name: string;
}

export class PostIsConnectedResponse {
  connected: boolean;
}
