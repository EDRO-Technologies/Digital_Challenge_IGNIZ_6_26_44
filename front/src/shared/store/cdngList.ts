import { create } from "zustand";

import { getNgduList } from "@/shared/api";
import { handleError } from "@/shared/utils";

interface ICdngListState {
  isLoading: boolean;
  cdngList: IBaseObject[];
}

interface ICdngListActions {
  setValue: <T extends keyof ICdngListState>(field: T, value: ICdngListState[T]) => void;
  fetchNgduList: (searchParams?: URLSearchParams) => void;
}

export type TCdngListStore = ICdngListState & ICdngListActions;

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
