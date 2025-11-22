import { create } from "zustand";

import { type IPostNgduGraphParams, postNgduGraph } from "../api/postNgduGraph";

interface State {
  error: unknown | null;
  isLoading: boolean;
  nodes: INode[] | null;
  edges: ILink[] | null;
}

interface Actions {
  fetchGraph: (dto: IPostNgduGraphParams) => void;
}

export const useGraphStore = create<State & Actions>((set) => {
  const withLoading = async (fn: () => Promise<void>) => {
    set({ isLoading: true, error: null });
    try {
      await fn();
    } catch (error) {
      set({ error });
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    nodes: null,
    edges: null,
    isLoading: false,
    error: null,
    fetchGraph: async (params) =>
      withLoading(async () => {
        const res = await postNgduGraph(params);
        set({ edges: res.data.message.edges, nodes: res.data.message.nodes });
      })
  };
});
