interface BootstrapAppOptions {
  loadInitialRoute: () => Promise<void>;
  removeStaticSeo: () => void;
  renderApp: () => void;
  reportLoadError?: (error: unknown) => void;
}

export async function bootstrapApp({
  loadInitialRoute,
  removeStaticSeo,
  renderApp,
  reportLoadError = (error) => {
    console.error("Unable to load the initial route.", error);
  },
}: BootstrapAppOptions) {
  try {
    await loadInitialRoute();
  } catch (error) {
    reportLoadError(error);
  }

  removeStaticSeo();
  renderApp();
}
