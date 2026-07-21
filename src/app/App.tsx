import { LazyMotion, MotionConfig } from "motion/react";
import { AppProviders } from "./providers";

const loadMotionFeatures = () =>
  import("./motionFeatures").then((module) => module.default);

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <AppProviders />
      </LazyMotion>
    </MotionConfig>
  );
}
