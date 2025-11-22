import { create } from "zustand";

import { getNgduList } from "@/shared/api";
import { handleError } from "@/shared/utils";

import type { TCdngListStore } from "./types";

export const useCdngListStore = create<TCdngListStore>((set) => ({
  cdngList: [],
  isLoading: false,
  setValue: (field, value) => set({ [field]: value }),
  fetchNgduList: async (searchParams) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(searchParams);

      const { data } = await getNgduList({ query: params.get("search") });

      set({ cdngList: data.message });
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
