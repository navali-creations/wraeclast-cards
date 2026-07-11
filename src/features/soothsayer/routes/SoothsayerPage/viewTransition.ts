type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
  };
};

// Runs `update` inside a View Transition when the browser supports it and the
// user hasn't asked for reduced motion, falling back to calling it directly.
export function runWithViewTransition(update: () => void) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    update();
    return;
  }

  const startViewTransition = (document as ViewTransitionDocument)
    .startViewTransition;

  if (typeof startViewTransition === "function") {
    startViewTransition.call(document, update);
    return;
  }

  update();
}
