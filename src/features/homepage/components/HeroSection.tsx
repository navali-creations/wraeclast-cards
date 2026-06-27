import { useGame } from "../../../app/game-context";
import { ButtonInternalLink } from "../../../components/buttons/ButtonLink";
import { H1 } from "../../../components/headings";
import { Text } from "../../../components/text";
import { EGame } from "../../../enums";
import { useDropRatesIndex } from "../api/getDropRatesIndex";

const CURRENT_LEAGUE: Record<EGame, string> = {
  [EGame.Poe1]: "Mirage League",
  [EGame.Poe2]: "Return of the Ancients",
};

export function HeroSection() {
  const { game } = useGame();
  const { data } = useDropRatesIndex();
  const leaguesArchived =
    (data?.games.poe1.league_count ?? 0) + (data?.games.poe2.league_count ?? 0);

  const heroStats = [
    { value: "451+", label: "Divination Cards" },
    {
      value: data ? String(leaguesArchived) : "…",
      label: "Leagues Archived",
    },
    { value: "45M+", label: "Deck Openings" },
  ];

  return (
    <div className="flex flex-col gap-8 lg:py-4">
      {/* League badge */}
      <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-(--wc-border) bg-base-300 px-3 py-1 text-sm text-(--wc-text-60)">
        <span className="h-1.5 w-1.5 rounded-full bg-(--wc-live-dot)" />
        {game === EGame.Poe1 ? "PoE 1" : "PoE 2"} · {CURRENT_LEAGUE[game]}
      </div>

      {/* Hero heading */}
      <H1 className="font-cinzel leading-snug tracking-wider">
        <span className="block text-5xl text-(--wc-text-90) lg:text-6xl">
          No Exile
        </span>
        <span className="ml-6 block bg-linear-to-r from-(--wc-gold) to-amber-200 bg-clip-text text-7xl text-transparent lg:text-8xl">
          Drops
        </span>
        <span className="block text-5xl text-(--wc-text-90) lg:text-6xl">
          Unseen
        </span>
      </H1>

      {/* Subtitle */}
      <Text
        size="base"
        className="max-w-sm md:max-w-md lg:max-w-sm leading-relaxed text-(--wc-text-60)"
      >
        The complete divination card reference for Path of Exile — live prices,
        drop analytics, and stacked deck tracking.
      </Text>

      {/* CTA buttons */}
      <div className="flex items-center gap-4">
        <ButtonInternalLink
          to="/cards"
          className="inline-flex h-12 w-40 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-content hover:bg-(--wc-primary-hover)"
        >
          Browse Cards
        </ButtonInternalLink>
        <ButtonInternalLink
          to="/stacked-decks"
          className="inline-flex h-12 w-40 items-center justify-center rounded-lg border border-(--wc-border) bg-(--wc-glow)/20 px-5 text-sm font-medium text-(--wc-text-70) hover:border-(--wc-accent-border) hover:bg-(--wc-glow)/45 hover:text-(--wc-text-90)"
        >
          Stacked Decks →
        </ButtonInternalLink>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6">
        {heroStats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="font-fontin text-2xl font-bold text-(--wc-gold)">
              {stat.value}
            </span>
            <span className="text-xs text-(--wc-text-50)">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
