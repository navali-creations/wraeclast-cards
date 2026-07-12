import { SiteLogo } from "../site-logo/SiteLogo";
import { Text } from "../text";

export function FooterBrand() {
  return (
    <div className="sm:max-w-64">
      <SiteLogo className="text-xl" />
      <Text size="sm" muted className="mt-2">
        Divination card database, price tracking, and stacked deck analytics for
        Path of Exile.
      </Text>
    </div>
  );
}
