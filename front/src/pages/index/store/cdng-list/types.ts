interface ICdngListState {
  isLoading: boolean;
  cdngList: ICdng[];
}

interface ICdngListActions {
  setValue: <T extends keyof ICdngListState>(field: T, value: ICdngListState[T]) => void;
  fetchNgduList: (searchParams: URLSearchParams) => void;
}

export type TCdngListStore = ICdngListState & ICdngListActions;
