import clsx from "clsx";
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Button } from "../../../../components/buttons";

type PageToken =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: "left" | "right" };

// Max tokens = [first] [ellipsis] [prev] [current] [next] [ellipsis] [last]
const MAX_PAGE_TOKENS = 7;

function buildPageRange(current: number, total: number): PageToken[] {
  if (total <= MAX_PAGE_TOKENS) {
    return Array.from({ length: total }, (_, i) => ({
      type: "page" as const,
      value: i + 1,
    }));
  }

  const range: PageToken[] = [{ type: "page", value: 1 }];
  if (current > 3) range.push({ type: "ellipsis", id: "left" });

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) range.push({ type: "page", value: i });

  if (current < total - 2) range.push({ type: "ellipsis", id: "right" });
  range.push({ type: "page", value: total });

  return range;
}

const btnBase =
  "flex h-9 w-9 items-center justify-center rounded border text-sm font-cinzel transition-all duration-150 select-none";
const btnEnabled =
  "cursor-pointer border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/40 hover:text-(--wc-gold-muted)";
const btnDisabled =
  "cursor-not-allowed border-(--wc-border) text-(--wc-text-30) opacity-40";

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={clsx(btnBase, disabled ? btnDisabled : btnEnabled)}
    >
      {children}
    </button>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  function handlePrevPageClick() {
    onChange(page - 1);
  }

  function handleNextPageClick() {
    onChange(page + 1);
  }

  function handlePageClick(p: number) {
    onChange(p);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        <NavButton
          label="Previous page"
          disabled={page === 1}
          onClick={handlePrevPageClick}
        >
          <HiChevronLeft className="size-4" />
        </NavButton>

        <div className="flex items-center gap-1 mx-1">
          {buildPageRange(page, totalPages).map((token) =>
            token.type === "ellipsis" ? (
              <span
                key={`ellipsis-${token.id}`}
                className="flex h-9 w-6 items-center justify-center text-(--wc-text-40) select-none"
              >
                …
              </span>
            ) : (
              <Button
                key={token.value}
                variant={token.value === page ? "pageActive" : "page"}
                aria-label={`Page ${token.value}`}
                aria-current={token.value === page ? "page" : undefined}
                onClick={() => handlePageClick(token.value)}
              >
                {token.value}
              </Button>
            ),
          )}
        </div>

        <NavButton
          label="Next page"
          disabled={page === totalPages}
          onClick={handleNextPageClick}
        >
          <HiChevronRight className="size-4" />
        </NavButton>
      </div>

      <PageJump
        key={page}
        page={page}
        totalPages={totalPages}
        onChange={onChange}
      />
    </div>
  );
}

function PageJump({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const [value, setValue] = useState(String(page));

  function commit() {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) {
      onChange(Math.min(Math.max(1, n), totalPages));
    } else {
      setValue(String(page));
    }
  }

  return (
    <p className="flex items-center gap-2 text-xs font-cinzel tracking-widest uppercase text-(--wc-text-40)">
      Page
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="h-6 w-10 rounded border border-(--wc-border) bg-[color-mix(in_oklch,var(--wc-card-darker)_84%,black)] px-1 text-center text-xs font-cinzel text-(--wc-text-80) shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--wc-gold-dim)_8%,transparent)] outline-none transition-colors focus:border-(--wc-gold-dim) focus:ring-1 focus:ring-[color-mix(in_oklch,var(--wc-gold-dim)_20%,transparent)]"
      />
      of {totalPages}
    </p>
  );
}
