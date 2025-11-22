import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { PATHS } from "@/shared/constants";
import { createRoute } from "@/shared/utils";

const IndexScreen = lazy(() => import("@/pages/index/page"));

const IndexRoute = createRoute(PATHS.INDEX, <IndexScreen />);

export const router = createBrowserRouter([IndexRoute]);
