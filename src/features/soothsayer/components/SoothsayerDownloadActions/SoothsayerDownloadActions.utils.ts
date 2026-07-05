export type SoothsayerDownloadPlatform = "windows" | "linux" | "mobile";

const defaultPlatform: SoothsayerDownloadPlatform = "mobile";

export function detectSoothsayerDownloadPlatform(): SoothsayerDownloadPlatform {
  if (typeof navigator === "undefined") return defaultPlatform;

  const platform = navigator.platform.toLowerCase();

  if (platform.includes("win")) return "windows";
  if (
    platform.includes("linux") &&
    (platform.includes("x86_64") ||
      platform.includes("x64") ||
      platform.includes("amd64"))
  ) {
    return "linux";
  }

  return defaultPlatform;
}
