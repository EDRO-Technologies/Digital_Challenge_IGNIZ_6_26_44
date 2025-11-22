import type { ComboboxItem } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useCdngListStore } from "@/shared/store/cdngList";
import { updateSearchParams } from "@/shared/utils";

export const useNavbar = () => {
  const { cdngListTables, isLoading, fetchNgduListTables } = useCdngListStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const currentTopology = searchParams.get("topology");
  const navigate = useNavigate();

  const [debouncedSearchvalue] = useDebouncedValue(searchValue, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const updateParams = updateSearchParams(searchParams, setSearchParams);

  const setTopologyType = (option: ComboboxItem) => {
    updateParams({
      topology: option.value
    });
  };

  useEffect(() => {
    fetchNgduListTables(debouncedSearchvalue);
  }, [debouncedSearchvalue]);

  const onSelectObject = (newItem: number) => {
    const newUrl = `${location.origin}/${newItem}${location.search}`;
    navigate(newUrl);
  };

  return {
    state: { cdngListTables, isLoading, currentTopology, searchValue },
    functions: { setTopologyType, handleSearchChange, onSelectObject }
  };
};
