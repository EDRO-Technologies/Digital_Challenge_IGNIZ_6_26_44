import { AppShell, Divider, ScrollArea, Select, Skeleton, Stack, TextInput } from "@mantine/core";
import { SearchIcon } from "lucide-react";

import styles from "./Navbar.module.css";
import { SELECT_TOPOLOGY_DATA } from "./constants";
import { renderDataSections } from "./helpers";
import { useNavbar } from "./hooks/useNavbar";

export const Navbar = () => {
  const { state, functions } = useNavbar();

  return (
    <AppShell.Navbar>
      <AppShell.Section px={20} pt={20}>
        <Select
          classNames={{ input: styles.select_input }}
          chevronColor='white'
          allowDeselect={false}
          value={state.currentTopology}
          data={SELECT_TOPOLOGY_DATA}
          onChange={(_, option) => functions.setTopologyType(option)}
        />
      </AppShell.Section>

      <Divider my='md' />

      <AppShell.Section px={20}>
        <TextInput
          value={state.searchValue}
          onChange={functions.handleSearchChange}
          radius={12}
          placeholder='Поиск'
          leftSection={<SearchIcon size={16} />}
        />
      </AppShell.Section>
      <ScrollArea className={styles.scrollArea}>
        {state.cdngListTables &&
          !state.isLoading &&
          renderDataSections(state.cdngListTables, functions.onSelectObject)}
        {state.isLoading && (
          <Stack gap={12}>
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} w='100%' h={40} />
            ))}
          </Stack>
        )}
      </ScrollArea>
    </AppShell.Navbar>
  );
};
