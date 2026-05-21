import type { CardTone } from "../../types";
import { Card } from "../Card";
import {
  bodyClass,
  footnoteClass,
  footnoteText,
  headingClass,
} from "./authCardStyles";

interface AuthCardProps {
  tone: CardTone;
  icon: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
  showFootnote?: boolean;
}

export function AuthCard({
  tone,
  icon,
  title,
  description,
  actions,
  showFootnote = true,
}: AuthCardProps) {
  return (
    <Card tone={tone}>
      <div className="w-12 h-12 mx-auto mb-5">{icon}</div>
      <h2 className={headingClass}>{title}</h2>
      <p className={bodyClass}>{description}</p>
      {actions && <div className="mt-6">{actions}</div>}
      {showFootnote && (
        <p className={`mt-6 ${footnoteClass}`}>{footnoteText}</p>
      )}
    </Card>
  );
}
