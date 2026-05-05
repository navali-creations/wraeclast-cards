import { HeaderActions } from "./HeaderActions";
import { HeaderBrand } from "./HeaderBrand";
import { HeaderDesktopNavigation } from "./HeaderDesktopNavigation";
import { HeaderMobileNavigation } from "./HeaderMobileNavigation";

export function Header() {
  return (
    <nav className="bg-(--wc-nav-bg) border-b border-(--wc-border)">
      <div className="navbar mx-auto max-w-300 px-4">
        <div className="navbar-start items-center gap-1">
          <HeaderMobileNavigation />
          <HeaderBrand />
        </div>
        <HeaderDesktopNavigation />
        <HeaderActions />
      </div>
    </nav>
  );
}
