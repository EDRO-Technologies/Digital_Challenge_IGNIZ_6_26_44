import {
  Background,
  ConnectionMode,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import { useCallback, useLayoutEffect, useMemo } from "react";

import { useGraphStore } from "@/shared/store/graph";

import { nodeTypes } from "./nodeTypes";

const ELK_OPTIONS = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "40",
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED"
};

const NODE_DIMENSIONS = { width: 300, height: 50 };

const elk = new ELK();

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      ...NODE_DIMENSIONS
    })),
    edges
  };
  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y }
      })),
      edges: layoutedGraph.edges ?? edges
    }))
    .catch(console.error);
};
export function Flow() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const { fitView } = useReactFlow();
  const graphStore = useGraphStore();
  const initialNodes = useMemo(
    () =>
      graphStore.nodes!.map((node) => ({
        id: String(node.id),
        type: "custom",
        position: { x: 0, y: 0 },
        data: { label: node.name, type: node.type }
      })),
    [graphStore.nodes]
  );
  const initialEdges = useMemo(
    () =>
      graphStore.edges!.map((link) => ({
        id: `${link.sourceId}-${link.targetId}`,
        type: "smoothstep",
        source: String(link.sourceId),
        target: String(link.targetId)
      })),
    [graphStore.edges]
  );
  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { "elk.direction": direction, ...ELK_OPTIONS };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;
      getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        fitView({ padding: 0.2 });
      });
    },
    [nodes, edges]
  );
  useLayoutEffect(() => {
    onLayout({ direction: "RIGHT", useInitialNodes: true });
  }, []);
  return (
    <div style={{ width: "calc(100dvw - var(--app-shell-navbar-width))", height: "100dvh" }}>
      <ReactFlow
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={false}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        nodes={nodes}
        edges={edges}
        minZoom={0.1}
        onlyRenderVisibleElements
      >
        <Background />
        <Panel position='top-left'></Panel>
      </ReactFlow>
    </div>
  );
}
