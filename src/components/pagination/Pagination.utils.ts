type PageToken =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: "left" | "right" };

// Max tokens = [first] [ellipsis] [prev] [current] [next] [ellipsis] [last]
const MAX_PAGE_TOKENS = 7;

export function buildPageRange(current: number, total: number): PageToken[] {
  if (total <= MAX_PAGE_TOKENS) {
    return Array.from({ length: total }, (_, index) => ({
      type: "page" as const,
      value: index + 1,
    }));
  }

  const range: PageToken[] = [{ type: "page", value: 1 }];
  if (current > 3) range.push({ type: "ellipsis", id: "left" });

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page++)
    range.push({ type: "page", value: page });

  if (current < total - 2) range.push({ type: "ellipsis", id: "right" });
  range.push({ type: "page", value: total });

  return range;
}

export type { PageToken };
