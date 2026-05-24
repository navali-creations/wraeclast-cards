import { FooterBottomBar } from "./FooterBottomBar";
import { FooterBrand } from "./FooterBrand";
import { FooterNavigation } from "./FooterNavigation";

export function Footer() {
  return (
    <footer className="bg-(--wc-nav-bg) border-t border-(--wc-border)">
      <div className="mx-auto max-w-300 px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
          <FooterBrand />
          <FooterNavigation />
        </div>
        <FooterBottomBar />
      </div>
    </footer>
  );
}
