import { describe, expect, it } from "vitest";
import { renderNonHydratedSeoDocument } from "./seoDocument";

const TEMPLATE = `<!doctype html>
<html>
  <head>
    <script type="module" src="/assets/index.js"></script>
    <!--wraeclast-seo-head-->
  </head>
  <body>
    <div id="root">
      <script>self.$_TSR = {}</script>
      <!--wraeclast-seo-body-->
    </div>
  </body>
</html>`;

describe("renderNonHydratedSeoDocument", () => {
  it("preserves rendered content while removing executable scripts", () => {
    const document = renderNonHydratedSeoDocument(TEMPLATE, {
      pathname: "/404",
      title: "Page Not Found | wraeclast.cards",
      description: "The requested page could not be found.",
      robots: "noindex, nofollow",
      canonical: false,
      body: "<main>Page not found</main><script>hydrate()</script>",
    });

    expect(document).toContain("<main>Page not found</main>");
    expect(document).toContain("Page Not Found | wraeclast.cards");
    expect(document).toContain('content="noindex, nofollow"');
    expect(document).not.toContain("<script");
    expect(document).not.toContain("hydrate()");
    expect(document).not.toContain("self.$_TSR");
  });
});
