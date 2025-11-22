import { RouterProvider } from "react-router";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

import "@/assets/index.css";

import { router } from "./router";

export const Providers = () => (
  <MantineProvider>
    <Notifications />
    <RouterProvider router={router} />
  </MantineProvider>
);
