import { useState } from "react";

type PageJumpProps = {
  page: number;
  totalPages: number;
  onChange: (pageNumber: number) => void;
};

export function PageJump({ page, totalPages, onChange }: PageJumpProps) {
  const [value, setValue] = useState(String(page));

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function clampPage(pageNumber: number) {
    return Math.min(Math.max(1, pageNumber), totalPages);
  }

  function commitPage(inputValue: string) {
    const parsed = parseInt(inputValue, 10);
    if (Number.isNaN(parsed)) {
      setValue(String(page));
      return;
    }

    onChange(clampPage(parsed));
  }

  function handleCommit() {
    commitPage(value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleCommit();
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs font-cinzel tracking-widest uppercase text-(--wc-text-40)">
      Page
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInputChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className="h-6 w-10 rounded border border-(--wc-border) bg-[color-mix(in_oklch,var(--wc-card-darker)_84%,black)] px-1 text-center text-xs font-cinzel text-(--wc-text-80) shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--wc-gold-dim)_8%,transparent)] outline-none transition-colors focus:border-(--wc-gold-dim) focus:ring-1 focus:ring-[color-mix(in_oklch,var(--wc-gold-dim)_20%,transparent)]"
      />
      of {totalPages}
    </div>
  );
}
