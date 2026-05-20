import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { MdCheckCircle, MdWarningAmber } from "react-icons/md";
import { useOAuthCallback } from "../hooks/useOAuthCallback";

import { Button } from "./Button";
import { Card } from "./Card";
import { Spinner } from "./Spinner";

const routeApi = getRouteApi("/soothsayer/auth");

const headingClass =
  "mb-2 font-semibold text-xl tracking-wide text-base-content";
const bodyClass = "mb-6 text-sm leading-relaxed text-(--wc-text-50)";
const bodyCompactClass = "text-sm leading-relaxed text-(--wc-text-50)";
const footnoteClass = "text-(--wc-text-40) text-xs";
const footnoteText =
  "This page is used to securely complete authentication. You can close this tab once the app opens.";

interface AuthCardProps {
  tone: "normal" | "error" | "warning";
  icon: React.ReactNode;
  title: string;
  description: string;
  descriptionClass?: string;
  actions?: React.ReactNode;
  showFootnote?: boolean;
}

function AuthCard({
  tone,
  icon,
  title,
  description,
  descriptionClass,
  actions,
  showFootnote = true,
}: AuthCardProps) {
  return (
    <Card tone={tone}>
      {icon}
      <h2 className={headingClass}>{title}</h2>
      <p className={descriptionClass ?? bodyClass}>{description}</p>
      {actions}
      {showFootnote && <p className={footnoteClass}>{footnoteText}</p>}
    </Card>
  );
}

export function SoothsayerAuth() {
  const params = routeApi.useSearch();
  const state = useOAuthCallback(params);
  const navigate = useNavigate();

  const handleManualOpen = () => {
    if (state.phase === "invalid") return;
    navigate({ href: state.deepLink });
  };

  const handleDownload = () => {
    window.open("https://wraeclast.cards/downloads", "_blank");
  };

  let cardProps: AuthCardProps;

  switch (state.phase) {
    case "waiting":
      cardProps = {
        tone: "normal",
        icon: <Spinner />,
        title: "Opening Soothsayer…",
        description:
          "If a dialog appeared asking you to open the app, click Allow or Open.",
        descriptionClass: bodyClass,
        actions: (
          <Button variant="primary" onClick={handleManualOpen}>
            Open Soothsayer manually
          </Button>
        ),
        showFootnote: true,
      };
      break;
    case "success":
      cardProps = {
        tone: "normal",
        icon: (
          <div className="w-12 h-12 mx-auto mb-5">
            <MdCheckCircle className="mx-auto h-12 w-12 text-success" />
          </div>
        ),
        title: "Authorization successful!",
        description: "Opening Soothsayer…",
        descriptionClass: bodyClass,
        actions: (
          <Button variant="subtle" className="mb-4" onClick={handleManualOpen}>
            Open Soothsayer manually
          </Button>
        ),
        showFootnote: true,
      };
      break;
    case "error":
      cardProps = {
        tone: "error",
        icon: <Spinner failed tone="error" />,
        title: "Couldn't open Soothsayer",
        description:
          params.error_description ??
          "The app may not be installed, or the protocol handler isn't registered. Download Soothsayer and try again.",
        descriptionClass: bodyClass,
        actions: (
          <>
            <Button variant="error" onClick={handleManualOpen}>
              Try again
            </Button>
            <Button variant="subtle" className="mb-4" onClick={handleDownload}>
              Download Soothsayer →
            </Button>
          </>
        ),
        showFootnote: true,
      };
      break;
    case "invalid":
      cardProps = {
        tone: "warning",
        icon: (
          <div className="w-12 h-12 mx-auto mb-5">
            <MdWarningAmber className="mx-auto h-12 w-12 text-warning" />
          </div>
        ),
        title: "Invalid authorization callback",
        description:
          "Missing required parameters. This link may be expired or malformed.",
        descriptionClass: bodyCompactClass,
        actions: null,
        showFootnote: false,
      };
      break;
    default:
      cardProps = {
        tone: "normal",
        icon: <Spinner />,
        title: "Opening Soothsayer…",
        description:
          "Opening the Soothsayer desktop app to complete your sign-in. This should only take a moment.",
        descriptionClass: bodyClass,
        actions: null,
        showFootnote: true,
      };
  }

  return (
    <div className="h-full min-h-full flex items-center justify-center bg-base-content px-5">
      <div className="w-full max-w-sm">
        <AuthCard {...cardProps} />
      </div>
    </div>
  );
}
