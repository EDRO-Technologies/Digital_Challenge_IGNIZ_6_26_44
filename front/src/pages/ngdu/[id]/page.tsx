import { AppShell } from "@mantine/core";

import { useGraphStore } from "@/shared/store/graph";

import { Flow } from "./Flow";
import { Navbar } from "./components/Navbar/Navbar";

const NAVBAR_WIDTH = 300;

export function NgduPage() {
  // const graphStore = useGraphStore();

  // useEffect(() => {
  //   graphStore.fetchGraph();
  // }, [searchParams]);
  return (
    <AppShell navbar={{ width: NAVBAR_WIDTH, breakpoint: "xs" }}>
      <Navbar />

      <AppShell.Main>
        {/* <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider> */}
      </AppShell.Main>
    </AppShell>
  );
}

export default NgduPage;
