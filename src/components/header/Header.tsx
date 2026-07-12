import { HeaderActions } from "./HeaderActions";
import { HeaderBrand } from "./HeaderBrand";
import { HeaderDesktopNavigation } from "./HeaderDesktopNavigation";
import { HeaderMobileNavigation } from "./HeaderMobileNavigation";

export function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-(--wc-nav-bg) border-b border-(--wc-border)">
      <div className="mx-auto grid max-w-300 grid-cols-[1fr_auto] items-center px-4 max-xs:grid-cols-1 xl:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-1 min-w-0 h-14 xs:h-16">
          <HeaderMobileNavigation />
          <HeaderBrand />
        </div>
        <HeaderDesktopNavigation />
        <HeaderActions />
      </div>
    </nav>
  );
}
