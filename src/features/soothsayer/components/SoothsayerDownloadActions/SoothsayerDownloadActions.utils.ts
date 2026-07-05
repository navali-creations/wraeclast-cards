export type SoothsayerDownloadPlatform = "windows" | "linux" | "mobile";

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    mobile?: boolean;
    platform?: string;
  };
};

const defaultPlatform: SoothsayerDownloadPlatform = "mobile";

export function detectSoothsayerDownloadPlatform(): SoothsayerDownloadPlatform {
  if (typeof navigator === "undefined") return defaultPlatform;

  const browserNavigator = navigator as NavigatorWithUserAgentData;
  if (browserNavigator.userAgentData?.mobile) return defaultPlatform;

  const userAgentPlatform = browserNavigator.userAgentData?.platform;
  const platform = (
    userAgentPlatform ?? browserNavigator.platform
  ).toLowerCase();

  if (platform.includes("win")) return "windows";
  if (userAgentPlatform?.toLowerCase() === "linux") return "linux";
  if (platform.includes("linux") && browserNavigator.maxTouchPoints === 0) {
    return "linux";
  }

  return defaultPlatform;
}
