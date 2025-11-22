import { create } from "zustand";

import { getNgduList, getNgduListTables } from "@/shared/api";
import { handleError } from "@/shared/utils";

interface ICdngListState {
  isLoading: boolean;
  cdngList: IBaseObject[];
  cdngListTables?: {
    ngdu: IBaseObject[];
    mest: IBaseObject[];
    cdng: IBaseObject[];
    obj: IBaseObject[];
    plast: IBaseObject[];
    kust: IBaseObject[];
    well: IBaseObject[];
  };
}

interface ICdngListActions {
  setValue: <T extends keyof ICdngListState>(field: T, value: ICdngListState[T]) => void;
  fetchNgduList: (searchParams?: URLSearchParams) => void;
  fetchNgduListTables: (query: string) => void;
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
  },
  fetchNgduListTables: async (query: string) => {
    set({ isLoading: true });
    try {
      const { data } = await getNgduListTables({ query });

      set({ cdngListTables: data.message });
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
