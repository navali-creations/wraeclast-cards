# Stacked Decks League Comparison

## Goal

Add a dedicated comparison experience that helps users:

1. Find the cards whose observed stacked-deck rates moved most between leagues.
2. Compare exact card values across every available league.
3. Inspect one card's history across leagues.

The experience uses real published league datasets and remains usable from
320px phones through wide desktop screens.

## Route and discovery

- Route: `/$game/$league/stacked-decks/compare`
- Existing Stacked Decks header: add a **Compare** action between Search and
  Advanced.
- Footer: add a quieter **Compare leagues** link.
- The route remains game- and league-scoped so existing navigation context is
  preserved, even though comparison selection can include every league.

## Shared controls

- View: Movers, Matrix, or History.
- Metric: Players Saw by default; future options can include Compared to
  Reference, Community Weight, and Drops Reported.
- Leagues: every available league selected by default.
- Baseline: newest/latest selected league by default; user-selectable.
- Verified only: switches ratios and counts to their verified counterparts.
- Card search.
- Minimum observations filter.

Comparison state should be URL-addressable once the interaction model settles,
so useful comparisons can be bookmarked and shared.

## Comparison semantics

For Players Saw:

- Primary value: the league's absolute observed share.
- Secondary value: relative change from the baseline league.
- Detail/tooltip: raw percentage-point difference and drops reported.
- Baseline cells display **Baseline**, not `+0%`.
- Missing values and zero baseline values produce `—`, not an invalid or
  misleading delta.
- The product does not claim statistical significance. Observation counts
  remain visible, and users can explicitly filter by a minimum count.

## Views

### Movers

Rank cards by their largest increase or decrease against the baseline across
the selected leagues. Each result names the league that produced that movement.
Users may narrow the ranking from all selected leagues to a single league.

### Matrix

Rows are cards and columns are selected leagues. The Card column and baseline
league stay visually anchored. Each league consumes one compact column for the
currently selected metric instead of multiplying every league by every metric.
Rows can be sorted by card name, baseline value, or largest absolute movement.

### History

Focus on one searched/selected card. Show its values chronologically, mark the
baseline, optionally show its reference value, and list exact league values
below the visual trend.

## Responsive behavior

### Phone: 320–639px

- Views remain available as single-line Movers, Matrix, and History controls.
- Comparison settings collapse into a touch-friendly disclosure.
- Matrix becomes an expandable card list:
  - Collapsed: card name, baseline value, strongest delta.
  - Expanded: one vertical row per selected league, newest first.
- Movers becomes a compact ranked list.
- History uses a full-width trend followed by exact vertical league rows.
- All leagues remain selected without requiring horizontal page scrolling.

### Tablet: 640–959px

- Controls use two wrapping rows.
- Matrix presents Card, Baseline, and a small window of comparison leagues.
- Remaining selected leagues can be paged in groups.
- Expanded card details remain available.

### Laptop and desktop: 960px+

- Full matrix with sticky Card and highlighted baseline columns.
- Other leagues appear newest to oldest.
- The matrix may own an internal horizontal scroller; the page never overflows.
- Wider screens reveal more league columns without changing the data.

The completed implementation must be visually checked at 320, 375, 414, 768,
960, and 1440px.

## Data flow

- Reuse the existing static game index and per-league drop-rate JSON files.
- Fetch the baseline dataset first, then the other selected leagues in parallel.
- Join cards by their normalized card identity.
- Keep per-league loading and failure states independent so one failed archive
  does not blank the entire comparison.
- Cache league datasets through the existing React Query client.
- Avoid creating a new server dependency.

If real-world load measurements show that loading every league file is too
expensive, a compact comparison artifact may be generated at build time later.
That optimization is intentionally deferred until measured.

## Error and empty states

- Baseline failure: explain that comparisons need a baseline and allow another
  loaded league to be selected.
- Individual league failure: keep its column/row present with Retry.
- No selected leagues: prevent the state or provide a clear reset-to-all action.
- Fewer than two leagues: explain that at least two are needed.
- Missing card in one league: show `—`.
- No search matches: retain controls and show a local empty state.

## Prototype scope

The first implementation should prioritize a real-data UX prototype:

- Dedicated route and discovery links.
- Working shared controls.
- Players Saw metric.
- User-selectable leagues and baseline.
- Functional Movers, responsive Matrix, and History representations.
- Verified mode and card search where they materially help evaluate the design.

Additional metrics, URL persistence for every control, advanced statistical
analysis, and build-time comparison aggregation can follow after the prototype
is evaluated.

## Testing

- Unit-test cross-league joins and delta calculations, including missing and
  zero baselines.
- Test baseline fallback when league selection changes.
- Test loading, partial failure, empty search, and verified-mode behavior.
- Test phone Matrix expansion and desktop sticky-column structure.
- Verify keyboard and touch access for every control.
- Run the existing hydration suite, TypeScript, Biome, and production build.
