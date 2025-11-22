import type { NodeTypes } from "@xyflow/react";

import { CustomNode } from "./CustomNode";

export type CustomNodeType = "custom" | "advanced";

export const nodeTypes: NodeTypes = {
  custom: CustomNode
};
