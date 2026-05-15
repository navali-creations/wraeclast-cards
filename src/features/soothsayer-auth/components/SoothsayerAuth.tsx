import clsx from "clsx";
import { MdCheckCircle, MdWarningAmber } from "react-icons/md";
import { useOAuthCallback } from "../hooks/useOAuthCallback";
import type { OAuthCallbackParams } from "../types";
import { Spinner } from "./Spinner";

interface SoothsayerAuthProps {
  params: OAuthCallbackParams;
}

export function SoothsayerAuth({ params }: SoothsayerAuthProps) {
  const state = useOAuthCallback(params);

  const cardClass = "rounded-2xl p-8 text-center shadow-2xl";
  const normalCardClass = clsx(
    cardClass,
    "border border-base-content/10 bg-base-200",
  );
  const errorCardClass = clsx(cardClass, "border border-error/30 bg-error/15");
  const warningCardClass = clsx(
    cardClass,
    "border border-warning/30 bg-warning/15",
  );

  const headingClass =
    "mb-2 font-semibold text-xl tracking-wide text-base-content";
  const bodyClass = "mb-6 text-sm leading-relaxed text-(--wc-text-50)";
  const footnoteClass = "text-(--wc-text-40) text-xs";

  const buttonClass =
    "w-full rounded-lg py-2.5 font-medium text-sm transition-all active:scale-[0.98]";
  const subtleButtonClass = clsx(
    buttonClass,
    "border border-base-content/20 text-(--wc-text-60) hover:bg-base-content/5",
  );
  const primaryButtonClass = clsx(
    buttonClass,
    "mb-4 bg-primary text-primary-content hover:bg-(--wc-primary-hover)",
  );
  const errorButtonClass = clsx(
    buttonClass,
    "mb-3 bg-error text-error-content hover:brightness-110",
  );

  const handleManualOpen = () => {
    window.location.href = state.deepLink;
  };

  const handleDownload = () => {
    window.open("https://wraeclast.cards/downloads", "_blank");
  };

  const footnoteText =
    "This page is used to securely complete authentication. You can close this tab once the app opens.";

  let cardToneClass = normalCardClass;
  let icon: React.ReactNode = <Spinner />;
  let title = "Opening Soothsayer…";
  let description =
    "Opening the Soothsayer desktop app to complete your sign-in. This should only take a moment.";
  let descriptionClass = bodyClass;
  let actions: React.ReactNode = null;
  let showFootnote = true;

  if (state.phase === "waiting") {
    description =
      "If a dialog appeared asking you to open the app, click Allow or Open.";
    actions = (
      <button
        type="button"
        onClick={handleManualOpen}
        className={primaryButtonClass}
      >
        Open Soothsayer manually
      </button>
    );
  }

  if (state.phase === "success") {
    icon = (
      <div className="w-12 h-12 mx-auto mb-5">
        <MdCheckCircle className="mx-auto h-12 w-12 text-success" />
      </div>
    );
    title = "Authorization successful!";
    description = "Opening Soothsayer…";
    actions = (
      <button
        type="button"
        onClick={handleManualOpen}
        className={clsx(subtleButtonClass, "mb-4")}
      >
        Open Soothsayer manually
      </button>
    );
  }

  if (state.phase === "error") {
    cardToneClass = errorCardClass;
    icon = <Spinner failed tone="error" />;
    title = "Couldn't open Soothsayer";
    description =
      params.error_description ??
      "The app may not be installed, or the protocol handler isn't registered. Download Soothsayer and try again.";
    actions = (
      <>
        <button
          type="button"
          onClick={handleManualOpen}
          className={errorButtonClass}
        >
          Try again
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className={clsx(subtleButtonClass, "mb-4")}
        >
          Download Soothsayer →
        </button>
      </>
    );
  }

  if (state.phase === "invalid") {
    cardToneClass = warningCardClass;
    icon = (
      <div className="w-12 h-12 mx-auto mb-5">
        <MdWarningAmber className="mx-auto h-12 w-12 text-warning" />
      </div>
    );
    title = "Invalid authorization callback";
    description =
      "Missing required parameters. This link may be expired or malformed.";
    descriptionClass = "text-sm leading-relaxed text-(--wc-text-50)";
    showFootnote = false;
  }

  return (
    <div className="h-full min-h-full flex items-center justify-center bg-base-content px-5">
      <div className="w-full max-w-sm">
        <div className={cardToneClass}>
          {icon}
          <h2 className={headingClass}>{title}</h2>
          <p className={descriptionClass}>{description}</p>
          {actions}
          {showFootnote && <p className={footnoteClass}>{footnoteText}</p>}
        </div>
      </div>
    </div>
  );
}
