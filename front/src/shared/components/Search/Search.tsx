import type { TextInputProps } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { SearchIcon } from "lucide-react";

import { useSearch } from "./hooks/useSearch";

interface ISearchProps extends TextInputProps {
  paramName: string;
}

export const Search = ({ paramName, ...props }: ISearchProps) => {
  const { state, functions } = useSearch({ name: paramName });

  return (
    <TextInput
      {...props}
      value={state.searchValue}
      onChange={functions.handleSearchChange}
      radius={12}
      size='lg'
      leftSection={<SearchIcon size={16} />}
    />
  );
};
