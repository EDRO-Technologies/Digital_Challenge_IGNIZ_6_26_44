import { create } from "zustand";

import { getNgduList } from "@/shared/api";
import { handleError } from "@/shared/utils";

import type { TCdngListStore } from "./types";

export const useCdngListStore = create<TCdngListStore>((set) => ({
  cdngList: [],
  isLoading: false,
  setValue: (field, value) => set({ [field]: value }),
  fetchNgduList: async () => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();

      const { data } = await getNgduList({ query: params.get("search") || "" });

      set({ cdngList: data });
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
