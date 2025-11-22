import { RouterProvider } from "react-router";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import { router } from "./router";

export const Providers = () => (
  <MantineProvider>
    <RouterProvider router={router} />
  </MantineProvider>
);
