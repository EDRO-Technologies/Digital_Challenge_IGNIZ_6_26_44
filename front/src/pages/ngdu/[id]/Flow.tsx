import {
  Background,
  ConnectionMode,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import { useCallback, useLayoutEffect } from "react";

import { useGraphStore } from "@/shared/store/graph";

import { CollapsableNode } from "./CollapsableNode";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80"
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50
    })),
    edges: edges
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y }
      })),

      edges: layoutedGraph.edges
    }))
    .catch(console.error);
};

const nodeTypes = {
  collapsable: CollapsableNode
};

export function Flow() {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const graphStore = useGraphStore();

  const initialNodes: Node[] = graphStore.nodes!.map((node) => ({
    id: String(node.id),
    data: {
      label: node.name,
      type: node.type
    },
    position: { x: 0, y: 0 }
    // type: "collapsable"
  }));

  const initialEdges: Edge[] = graphStore.edges!.map((link) => ({
    id: String(`${link.sourceId}-${link.targetId}`),
    type: "smoothstep",
    source: String(link.sourceId),
    target: String(link.targetId)
  }));

  const onLayout = useCallback(
    ({ direction, useInitialNodes = false }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        fitView();
      });
    },
    [nodes, edges]
  );

  useLayoutEffect(() => {
    onLayout({ direction: "DOWN", useInitialNodes: true });
  }, []);

  return (
    <div style={{ width: "calc(100dvw - var(--app-shell-navbar-width))", height: "100dvh" }}>
      <ReactFlow
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={false}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <MiniMap />
        <Panel position='top-left'></Panel>
      </ReactFlow>
    </div>
  );
}
