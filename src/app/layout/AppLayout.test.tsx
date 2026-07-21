/** @vitest-environment jsdom */

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { type ReactNode, useEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppLayout } from "./AppLayout";

vi.mock("motion/react-m", () => ({
  div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("../../components/footer/Footer", () => ({ Footer: () => null }));
vi.mock("../../components/header/Header", () => ({ Header: () => null }));

window.scrollTo = vi.fn();

afterEach(cleanup);

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function createTestRouter(cardsMounted: () => void) {
  const stackedDecksLoader = deferred();

  function CardsPage() {
    useEffect(cardsMounted, []);
    return <h1>Cards page</h1>;
  }

  const rootRoute = createRootRoute({ component: AppLayout });
  const cardsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/cards",
    validateSearch: (search: Record<string, unknown>) => ({
      name: typeof search.name === "string" ? search.name : undefined,
    }),
    component: CardsPage,
  });
  const stackedDecksRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/stacked-decks",
    loader: () => stackedDecksLoader.promise,
    component: () => <h1>Stacked decks page</h1>,
  });
  const routeTree = rootRoute.addChildren([cardsRoute, stackedDecksRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/cards"] }),
  });

  return { router, stackedDecksLoader };
}

describe("AppLayout route animation", () => {
  it("keeps the committed page mounted until navigation completes", async () => {
    const cardsMounted = vi.fn();
    const { router, stackedDecksLoader } = createTestRouter(cardsMounted);
    await router.load();

    render(<RouterProvider router={router} />);
    expect(await screen.findByText("Cards page")).not.toBeNull();
    expect(cardsMounted).toHaveBeenCalledTimes(1);

    let navigation!: Promise<void>;
    await act(async () => {
      navigation = router.navigate({ to: "/stacked-decks" });
      await Promise.resolve();
    });

    expect(screen.queryByText("Cards page")).not.toBeNull();
    expect(cardsMounted).toHaveBeenCalledTimes(1);

    await act(async () => {
      stackedDecksLoader.resolve();
      await navigation;
    });

    expect(await screen.findByText("Stacked decks page")).not.toBeNull();
    expect(screen.queryByText("Cards page")).toBeNull();
  });

  it("does not remount the page for search-only navigation", async () => {
    const cardsMounted = vi.fn();
    const { router } = createTestRouter(cardsMounted);
    await router.load();
    render(<RouterProvider router={router} />);
    expect(await screen.findByText("Cards page")).not.toBeNull();

    await act(async () => {
      await router.navigate({ to: "/cards", search: { name: "currency" } });
    });

    await waitFor(() => expect(cardsMounted).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Cards page")).not.toBeNull();
  });
});
