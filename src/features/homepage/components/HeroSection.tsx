import clsx from "clsx";
import { Text } from "../../../components/text";
import { useCardsQuery } from "../../cards/hooks";
import { useDropRatesIndex } from "../api/dropRatesIndex";
import { formatHomepageNumber, totalObservedDrops } from "../api/homepageStats";
import { useHeroQuote } from "../hooks/useHeroQuote";

export function HeroSection() {
  const { data } = useDropRatesIndex();
  const { data: cards } = useCardsQuery();
  const { quote, attribution, sizeClass: quoteSizeClass } = useHeroQuote();
  const games =
    data === undefined
      ? undefined
      : Object.values(data.games).filter((game) => game !== undefined);
  const leagues = games?.flatMap((game) => game.leagues);
  const leagueCount = games?.reduce(
    (total, game) => total + game.league_count,
    0,
  );

  const heroStats = [
    {
      value: formatHomepageNumber(cards?.length),
      label: "Divination Cards",
    },
    {
      value: formatHomepageNumber(leagueCount),
      label: "Leagues Archived",
    },
    {
      value: formatHomepageNumber(
        leagues === undefined ? undefined : totalObservedDrops(leagues),
      ),
      label: "Deck Openings",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-8">
      <h1 className="sr-only">
        Path of Exile divination cards and stacked deck drop rates
      </h1>
      <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,58%)_minmax(0,1fr)] md:gap-x-4 md:gap-y-8 lg:grid-cols-1 lg:justify-items-center lg:gap-8">
        <div className="flex flex-col gap-4 md:col-span-2 md:justify-self-center lg:col-span-1">
          <blockquote className="flex flex-col gap-4">
            <Text
              as="p"
              className={clsx(
                "max-w-none text-center font-fontin text-2xl font-bold leading-tight tracking-normal text-(--wc-gold) italic lg:max-w-[24ch]",
                quoteSizeClass,
              )}
            >
              &ldquo;{quote}&rdquo;
            </Text>

            <Text
              as="cite"
              size="sm"
              className="inline-flex items-center justify-end gap-2 self-end not-italic text-xs tracking-[0.14em] text-(--wc-text-70) sm:text-sm"
            >
              <span aria-hidden className="text-(--wc-gold)">
                ~
              </span>
              {attribution}
            </Text>
          </blockquote>
        </div>

        <div className="flex w-full flex-col gap-4 md:col-span-2 md:row-start-2 lg:col-span-1 lg:row-auto">
          <div className="h-px w-full bg-linear-to-r from-transparent via-(--wc-text-60) to-transparent" />
          <Text
            size="base"
            className="max-w-none text-center leading-relaxed text-(--wc-text-60)"
          >
            The complete divination card reference for Path of Exile — drop
            analytics, and stacked deck tracking.
          </Text>
          <div className="h-px w-full bg-linear-to-r from-transparent via-(--wc-text-60) to-transparent" />
        </div>

        <div className="flex w-full flex-col items-center gap-6 md:col-span-2 md:row-start-3 lg:col-auto lg:row-auto">
          <div className="flex flex-wrap justify-center gap-6 md:w-auto md:shrink-0 md:flex-nowrap md:gap-5 lg:justify-center lg:gap-6">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5 text-center md:min-w-0"
              >
                <span className="font-fontin text-2xl font-bold text-(--wc-gold)">
                  {stat.value}
                </span>
                <span className="text-xs text-(--wc-text-50)">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
