import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { PATHS } from "@/shared/constants";
import { createRoute } from "@/shared/utils";

const IndexScreen = lazy(() => import("@/pages/index/page"));
const NgduScreen = lazy(() => import("@/pages/ngdu/[id]/page"));

const IndexRoute = createRoute(PATHS.INDEX, <IndexScreen />);
const NgduRoute = createRoute(PATHS.NGDU, <NgduScreen />);

export const router = createBrowserRouter([IndexRoute, NgduRoute]);
