import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import type { router } from "../router";
import { AppProviders } from "./providers";
import type { queryClient } from "./queryClient";

const loadMotionFeatures = () =>
  import("./motionFeatures").then((module) => module.default);

interface AppProps {
  queryClient: typeof queryClient;
  router: typeof router;
  routerContent?: ReactNode;
}

export function App({ queryClient, router, routerContent }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <AppProviders
          queryClient={queryClient}
          router={router}
          routerContent={routerContent}
        />
      </LazyMotion>
    </MotionConfig>
  );
}
