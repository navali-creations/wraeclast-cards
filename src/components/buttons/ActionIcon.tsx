import { Button } from "./Button";

export function ActionIcon({
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
    <Button
      variant="secondary"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="disabled:cursor-not-allowed disabled:opacity-40 disabled:text-(--wc-text-30) disabled:hover:border-(--wc-border) disabled:hover:bg-transparent disabled:hover:text-(--wc-text-60)"
    >
      {children}
    </Button>
  );
}
