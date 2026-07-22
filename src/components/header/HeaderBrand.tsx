import { SiteLogo } from "../site-logo/SiteLogo";

export function HeaderBrand() {
  return (
    <SiteLogo
      className="px-1 text-lg xs:px-2 xs:text-xl sm:text-2xl"
      betaClassName="hidden xs:block"
    />
  );
}
