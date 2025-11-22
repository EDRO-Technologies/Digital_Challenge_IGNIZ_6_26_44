import type { TTarget } from '../types/ngdu.types';

export class Node {
  id: number;
  name: string;
  type: TTarget;
}

export class Links {
  sourceId: number;
  targetId: number;
}
