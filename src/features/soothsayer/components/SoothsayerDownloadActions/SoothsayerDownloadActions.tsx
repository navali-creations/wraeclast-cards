import { useState } from "react";
import { FaLinux, FaWindows } from "react-icons/fa";
import { FiDownload, FiGithub } from "react-icons/fi";
import type { IconType } from "react-icons/lib";
import { ButtonExternalLink } from "../../../../components/buttons";
import { Text } from "../../../../components/text";
import {
  detectSoothsayerDownloadPlatform,
  type SoothsayerDownloadPlatform,
} from "./SoothsayerDownloadActions.utils";

const windowsDownloadUrl =
  "https://github.com/navali-creations/soothsayer/releases/latest/download/Soothsayer.Setup.exe";
const linuxDownloadUrl =
  "https://github.com/navali-creations/soothsayer/releases/latest/download/Soothsayer.AppImage";
const githubUrl = "https://github.com/navali-creations/soothsayer";

type DownloadOption = {
  href: string;
  platformName: string;
  Icon: IconType;
};

type DownloadablePlatform = Exclude<SoothsayerDownloadPlatform, "mobile">;

const downloadOptions: Record<DownloadablePlatform, DownloadOption> = {
  windows: {
    href: windowsDownloadUrl,
    platformName: "Windows",
    Icon: FaWindows,
  },
  linux: {
    href: linuxDownloadUrl,
    platformName: "Linux",
    Icon: FaLinux,
  },
};

export function SoothsayerDownloadActions() {
  const [downloadPlatform] = useState(detectSoothsayerDownloadPlatform);
  const downloadOption =
    downloadPlatform === "mobile"
      ? undefined
      : downloadOptions[downloadPlatform];

  return (
    <div className="flex flex-col items-start gap-2 self-start">
      <div className="flex flex-wrap items-center gap-2">
        {downloadOption ? (
          <ButtonExternalLink
            href={downloadOption.href}
            download
            aria-label={`Download Soothsayer for ${downloadOption.platformName}`}
            className="inline-flex h-8 items-stretch overflow-hidden rounded-md border border-(--wc-gold-dim) bg-primary text-xs text-primary-content transition-colors hover:border-(--wc-gold) hover:bg-(--wc-primary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold-dim)"
          >
            <div className="flex items-center gap-1.5 px-3">
              <FiDownload aria-hidden="true" className="text-sm" />
              <Text as="span" weight="semibold">
                Download now
              </Text>
            </div>
            <div className="flex items-center gap-1.5 border-l border-primary-content/20 bg-black/15 px-2.5">
              <downloadOption.Icon
                aria-hidden="true"
                className="text-sm text-current"
              />
              <Text as="span" size="xs" weight="semibold">
                {downloadOption.platformName}
              </Text>
            </div>
          </ButtonExternalLink>
        ) : (
          <Text
            as="span"
            size="xs"
            className="max-w-52 rounded-md border border-(--wc-border) px-3 py-2 leading-snug text-(--wc-text-70)"
          >
            Available for desktop on windows and linux.
          </Text>
        )}

        <ButtonExternalLink
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View Soothsayer source on GitHub"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-(--wc-border) px-3 text-xs font-semibold text-(--wc-text-70) transition-colors hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/35 hover:text-(--wc-gold-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold-dim)"
        >
          <FiGithub aria-hidden="true" className="text-sm" />
          <Text as="span" weight="semibold">
            View source
          </Text>
        </ButtonExternalLink>
      </div>

      <Text as="span" size="xs" className="text-(--wc-text-60)">
        Open sourced under the AGPL license.
      </Text>
    </div>
  );
}
