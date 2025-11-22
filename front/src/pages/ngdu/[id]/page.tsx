import { AppShell, ScrollArea, Select } from "@mantine/core";
import { ReactFlowProvider } from "@xyflow/react";

import { Flow } from "./Flow";

const NAVBAR_WIDTH = 300;

export function NgduPage() {
  return (
    <AppShell navbar={{ width: NAVBAR_WIDTH, breakpoint: "xs" }}>
      <AppShell.Navbar>
        <AppShell.Section>
          <Select data={["React", "Angular", "Vue", "Svelte"]} />
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
