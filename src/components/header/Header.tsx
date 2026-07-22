import { HeaderActions } from "./HeaderActions";
import { HeaderBrand } from "./HeaderBrand";
import { HeaderDesktopNavigation } from "./HeaderDesktopNavigation";
import { HeaderMobileNavigation } from "./HeaderMobileNavigation";

export function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-(--wc-nav-bg) border-b border-(--wc-border)">
      <div className="mx-auto grid max-w-300 grid-cols-[minmax(0,1fr)_auto] items-center px-2 xs:px-4 md:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center gap-0.5 min-w-0 h-14 xs:h-16 xs:gap-1">
          <HeaderMobileNavigation />
          <HeaderBrand />
        </div>
        <HeaderDesktopNavigation />
        <HeaderActions />
      </div>
    </nav>
  );
}
