import type { TTarget, TTopology } from '../types/ngdu.types';

export class GetGraphRequest {
  topology: TTopology;
  type: TTarget;
  id: number;
}

export class Node {
  id: number;
  name: string;
  type: TTarget;
}

export class Links {
  sourceId: number;
  targetId: number;
}

export class GetGraphResponse {
  nodes: Node[];
  links: Links[];
}
