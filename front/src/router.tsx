import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router";

import { PATHS } from "@/shared/constants";
import { createRoute } from "@/shared/utils";

import { useCdngListStore } from "./shared/store/cdngList";
import { useGraphStore } from "./shared/store/graph";

const IndexScreen = lazy(() => import("@/pages/index/page"));
const NgduScreen = lazy(() => import("@/pages/ngdu/[id]/page"));

const IndexRoute = createRoute(PATHS.INDEX, <IndexScreen />, {
  loader: async () => {
    return useCdngListStore.getState().fetchNgduList();
  }
});

const NgduRoute = createRoute(PATHS.NGDU, <NgduScreen />, {
  loader: async ({ params, request }) => {
    const url = new URL(request.url);
    const searchTopology = url.searchParams.get("topology");
    const searchType = url.searchParams.get("type");

    if (!searchTopology || !searchType) {
      return redirect(PATHS.INDEX);
    }

    const id = Number(params.id);

    return useGraphStore.getState().fetchGraph({ topology: searchTopology, type: searchType, id });
  }
});

export const router = createBrowserRouter([IndexRoute, NgduRoute]);
