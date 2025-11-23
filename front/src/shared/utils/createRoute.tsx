import { Loader } from "@mantine/core";
import { Suspense } from "react";
import type { JSX } from "react";
import type { RouteObject } from "react-router";

function LoaderFallback() {
  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
        height: "100dvh"
      }}
    >
      <Loader size={50} />
    </div>
  );
}

export const createRoute = (
  path: string,
  component: JSX.Element,
  config?: RouteObject
): RouteObject => ({
  path,
  element: <Suspense fallback={<LoaderFallback />}>{component}</Suspense>,
  errorElement: <div className=''>Error</div>,
  ...config
});
