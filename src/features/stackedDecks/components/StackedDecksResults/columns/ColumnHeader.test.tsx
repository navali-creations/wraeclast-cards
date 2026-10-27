import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ColumnHeader } from "./ColumnHeader";

describe("ColumnHeader", () => {
  it("uses a dotted help label and superscript question-mark trigger", () => {
    const markup = renderToStaticMarkup(
      <ColumnHeader label="Estimate" tooltip="Estimated drop chance." />,
    );

    expect(markup).toContain("border-dotted");
    expect(markup).toContain("cursor-help");
    expect(markup).toContain("text-current");
    expect(markup).toContain("<sup");
    expect(markup).toContain(">?</sup>");
    expect(markup).toContain('role="tooltip"');
    expect(markup).toContain('popover="manual"');
    expect(markup).not.toContain("tooltip-content");
    expect(markup).toContain('aria-label="Estimate: Estimated drop chance."');
  });
});
