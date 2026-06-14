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

  function handleBlur() {
    commitPage(value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleBlur();
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs font-cinzel tracking-widest uppercase text-(--wc-text-40)">
      Page
      <input
        type="text"
        inputMode="numeric"
        min={1}
        max={totalPages}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-6 w-10 rounded border border-(--wc-border) bg-(--wc-card-darker) px-1 text-center text-xs font-cinzel text-(--wc-text-80) shadow-[inset_0_0_0_1px_var(--wc-border)] outline-none transition-colors focus:border-(--wc-gold-dim) focus:ring-1 focus:ring-(--wc-gold-dim)"
      />
      of {totalPages}
    </div>
  );
}
