import { Suspense } from "react";
import type { JSX } from "react";
import type { RouteObject } from "react-router";

export const createRoute = (
  path: string,
  component: JSX.Element,
  config?: RouteObject
): RouteObject => ({
  path,
  element: <Suspense fallback={<div>Загрузка...</div>}>{component}</Suspense>,
  errorElement: <div className=''>Error</div>,
  ...config
});
