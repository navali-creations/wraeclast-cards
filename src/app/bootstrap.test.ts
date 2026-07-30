import { describe, expect, it, vi } from "vitest";
import { bootstrapApp } from "./bootstrap";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

describe("bootstrapApp", () => {
  it("keeps the static fallback until the initial route is ready", async () => {
    const initialRoute = deferred();
    const events: string[] = [];
    const removeStaticSeo = vi.fn(() => events.push("remove-static-seo"));
    const renderApp = vi.fn(() => events.push("render-app"));

    const bootstrapPromise = bootstrapApp({
      loadInitialRoute: () => initialRoute.promise,
      removeStaticSeo,
      renderApp,
    });

    await Promise.resolve();

    expect(removeStaticSeo).not.toHaveBeenCalled();
    expect(renderApp).not.toHaveBeenCalled();

    initialRoute.resolve();
    await bootstrapPromise;

    expect(events).toEqual(["remove-static-seo", "render-app"]);
  });

  it("still mounts the app when the initial route load rejects unexpectedly", async () => {
    const loadError = new Error("route load failed");
    const removeStaticSeo = vi.fn();
    const renderApp = vi.fn();
    const reportLoadError = vi.fn();

    await bootstrapApp({
      loadInitialRoute: () => Promise.reject(loadError),
      removeStaticSeo,
      renderApp,
      reportLoadError,
    });

    expect(reportLoadError).toHaveBeenCalledWith(loadError);
    expect(removeStaticSeo).toHaveBeenCalledOnce();
    expect(renderApp).toHaveBeenCalledOnce();
  });
});
