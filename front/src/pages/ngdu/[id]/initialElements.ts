const position = { x: 0, y: 0 };
const type = "collapsable";

export const initialNodes = [
  {
    id: "1",
    position
  },
  {
    id: "2",
    type,
    position
  },
  {
    id: "2a",
    type,
    position
  },
  {
    id: "2b",
    type,

    position
  },
  {
    id: "2c",
    type,

    position
  },
  {
    id: "2d",
    type,

    position
  },
  {
    id: "3",
    type,

    position
  },
  {
    id: "4",
    type,

    position
  },
  {
    id: "5",
    type,

    position
  },
  {
    id: "6",
    type,
    position
  },
  { id: "7", type, position }
];

export const initialEdges = [
  { id: "e12", source: "1", target: "2", type: "smoothstep" },
  { id: "e13", source: "1", target: "3", type: "smoothstep" },
  { id: "e22a", source: "2", target: "2a", type: "smoothstep" },
  { id: "e22b", source: "2", target: "2b", type: "smoothstep" },
  { id: "e22c", source: "2", target: "2c", type: "smoothstep" },
  { id: "e2c2d", source: "2c", target: "2d", type: "smoothstep" },
  { id: "e45", source: "4", target: "5", type: "smoothstep" },
  { id: "e56", source: "5", target: "6", type: "smoothstep" },
  { id: "e57", source: "5", target: "7", type: "smoothstep" }
];
