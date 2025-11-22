import { AppShell } from "@mantine/core";
import { ReactFlowProvider } from "@xyflow/react";

import { Flow } from "./components/Flow";
import { Navbar } from "./components/Navbar/Navbar";

const NAVBAR_WIDTH = 300;

export function NgduPage() {
  return (
    <AppShell navbar={{ width: NAVBAR_WIDTH, breakpoint: "xs" }}>
      <Navbar />

      <AppShell.Main>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </AppShell.Main>
    </AppShell>
  );
}

export default NgduPage;
