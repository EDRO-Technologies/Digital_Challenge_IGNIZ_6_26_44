import { AppShell, type ComboboxItem, ScrollArea, Select } from "@mantine/core";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { useGraphStore } from "@/shared/store/graph";
import { updateSearchParams } from "@/shared/utils";

import { Flow } from "./Flow";

const NAVBAR_WIDTH = 300;

const SELECT_TOPOLOGY_DATA: ComboboxItem[] = [
  {
    value: "organizational",
    label: "Организационная"
  },
  {
    value: "geology",
    label: "Геологическая"
  }
];

const SELECT_TOPOLOGY_MAP = {
  organizational: "Организационная",
  geology: "Геологическая"
} as const;

export function NgduPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [topology, setTopology] = useState<ComboboxItem>(SELECT_TOPOLOGY_DATA[0]);

  const graphStore = useGraphStore();

  // useEffect(() => {
  //   graphStore.fetchGraph();
  // }, [searchParams]);
  return (
    <AppShell navbar={{ width: NAVBAR_WIDTH, breakpoint: "xs" }}>
      <AppShell.Navbar>
        <AppShell.Section>
          <Select
            allowDeselect={false}
            value={topology.value}
            data={SELECT_TOPOLOGY_DATA}
            onChange={(_, option) => setTopology(option)}
          />
        </AppShell.Section>

        <AppShell.Section></AppShell.Section>

        <AppShell.Section grow component={ScrollArea}></AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </AppShell.Main>
    </AppShell>
  );
}

export default NgduPage;
