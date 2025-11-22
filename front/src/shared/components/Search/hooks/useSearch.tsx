import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { updateSearchParams } from "@/shared/utils";

interface IUseCdngSearchParams {
  name: string;
}

export const useSearch = ({ name }: IUseCdngSearchParams) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValue = searchParams.get(name);
  const [searchValue, setSearchValue] = useState(initialValue || "");
  const updateParams = updateSearchParams(searchParams, setSearchParams);

  const [debouncedSearchvalue] = useDebouncedValue(searchValue, 300);

  useEffect(() => {
    updateParams({
      [name]: debouncedSearchvalue || ""
    });
  }, [debouncedSearchvalue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return { state: { searchValue }, functions: { handleSearchChange } };
};
