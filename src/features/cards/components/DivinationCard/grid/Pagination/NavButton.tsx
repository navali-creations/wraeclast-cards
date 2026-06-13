import { Button } from "../../../../../../components/buttons";

export function NavButton({
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
      variant="page"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="disabled:cursor-not-allowed disabled:opacity-40 disabled:text-(--wc-text-30) disabled:hover:border-(--wc-border) disabled:hover:bg-transparent disabled:hover:text-(--wc-text-60)"
    >
      {children}
    </Button>
  );
}
