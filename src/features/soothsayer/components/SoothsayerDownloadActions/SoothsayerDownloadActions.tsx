import { FaLinux, FaWindows } from "react-icons/fa";
import { ButtonExternalLink } from "../../../../components/buttons";

const windowsDownloadUrl =
  "https://github.com/navali-creations/soothsayer/releases/download/v0.19.1/Soothsayer-0.19.1.Setup.exe";
const linuxDownloadUrl =
  "https://github.com/navali-creations/soothsayer/releases/download/v0.19.1/Soothsayer-0.19.1.AppImage";

export function SoothsayerDownloadActions() {
  return (
    <div className="flex flex-wrap items-center gap-2 self-start">
      <ButtonExternalLink
        href={windowsDownloadUrl}
        download
        aria-label="Download Soothsayer for Windows"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 text-sm font-semibold text-(--wc-text-90) shadow-[0_10px_24px_-18px_var(--wc-gold)] transition-colors hover:border-(--wc-gold-dim) hover:text-(--wc-gold-bright)"
      >
        <FaWindows aria-hidden="true" className="text-base" />
        Windows
      </ButtonExternalLink>
      <ButtonExternalLink
        href={linuxDownloadUrl}
        download
        aria-label="Download Soothsayer for Linux"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--wc-border) px-4 text-sm font-semibold text-(--wc-text-70) transition-colors hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/40 hover:text-(--wc-gold-muted)"
      >
        <FaLinux aria-hidden="true" className="text-base" />
        Linux
      </ButtonExternalLink>
    </div>
  );
}
