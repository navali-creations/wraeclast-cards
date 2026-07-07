import clsx from "clsx";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { HiXMark } from "react-icons/hi2";
import { Input } from "./Input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export function SearchInput({
  value,
  onChange,
  suggestions,
  placeholder,
  leftIcon,
  containerClassName,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setIsOpen(false);
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const showSuggestions =
    isOpen && value.trim() !== "" && suggestions.length > 0;

  return (
    <Input
      type="text"
      value={value}
      onChange={handleInputChange}
      onFocus={() => setIsOpen(true)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      leftIcon={leftIcon}
      rightSlot={
        value && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
            className="rounded p-1 text-(--wc-text-70) hover:text-(--wc-gold-bright)"
          >
            <HiXMark className="size-4.5" />
          </button>
        )
      }
      containerClassName={containerClassName}
      containerRef={containerRef}
      autoComplete="off"
    >
      {showSuggestions && (
        <ul className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-(--wc-accent-border) bg-(--wc-card-darker) shadow-lg">
          {suggestions.map((name) => (
            <li key={name}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(name)}
                className={clsx(
                  "block w-full px-3 py-2 text-left text-sm text-(--wc-text-80)",
                  "hover:bg-(--wc-glow) hover:text-(--wc-gold-bright)",
                )}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Input>
  );
}
