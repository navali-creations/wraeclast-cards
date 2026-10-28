function validateTimeBucketSeries(game, leagueName, cardName, kind, buckets) {
  if (!Array.isArray(buckets) || buckets.length !== 96) {
    throw new Error(
      `Invalid ${kind} time buckets for ${game}/${leagueName}/${cardName}`,
    );
  }

  for (let index = 0; index < buckets.length; index++) {
    const bucket = buckets[index];
    if (
      !bucket ||
      bucket.minute !== index * 15 ||
      !Number.isInteger(bucket.count) ||
      bucket.count < 0
    ) {
      throw new Error(
        `Invalid ${kind} time bucket for ${game}/${leagueName}/${cardName}`,
      );
    }
  }
}

function sumTimeBucketSeries(buckets) {
  return buckets.reduce((sum, bucket) => sum + bucket.count, 0);
}

function validateLocationSeries(game, leagueName, cardName, locations) {
  const names = new Set();
  let total = 0;

  for (const location of locations) {
    if (
      !location ||
      typeof location.name !== "string" ||
      location.name.trim().length === 0 ||
      !Number.isInteger(location.count) ||
      location.count < 0 ||
      names.has(location.name)
    ) {
      throw new Error(
        `Invalid drop location for ${game}/${leagueName}/${cardName}`,
      );
    }
    names.add(location.name);
    total += location.count;
  }

  return total;
}

function validateDropContextCard(game, leagueName, card) {
  if (
    !card ||
    typeof card.name !== "string" ||
    card.name.trim().length === 0 ||
    !Number.isInteger(card.observed_events) ||
    card.observed_events < 0 ||
    !Number.isInteger(card.located_events) ||
    card.located_events < 0 ||
    card.located_events > card.observed_events ||
    !Array.isArray(card.locations)
  ) {
    throw new Error(`Invalid drop-context card for ${game}/${leagueName}`);
  }

  validateTimeBucketSeries(
    game,
    leagueName,
    card.name,
    "player-local",
    card.local_time_buckets,
  );
  validateTimeBucketSeries(
    game,
    leagueName,
    card.name,
    "UTC",
    card.utc_time_buckets,
  );

  if (
    sumTimeBucketSeries(card.local_time_buckets) !== card.observed_events ||
    sumTimeBucketSeries(card.utc_time_buckets) !== card.observed_events ||
    validateLocationSeries(game, leagueName, card.name, card.locations) >
      card.located_events
  ) {
    throw new Error(
      `Inconsistent drop-context totals for ${game}/${leagueName}/${card.name}`,
    );
  }
}

function validateDropContextTotals(game, leagueName, totals) {
  if (
    !totals ||
    !Number.isInteger(totals.observed_events) ||
    totals.observed_events < 0 ||
    !Number.isInteger(totals.located_events) ||
    totals.located_events < 0 ||
    totals.located_events > totals.observed_events ||
    !Array.isArray(totals.locations)
  ) {
    throw new Error(`Invalid drop-context totals for ${game}/${leagueName}`);
  }

  validateTimeBucketSeries(
    game,
    leagueName,
    "all cards",
    "player-local total",
    totals.local_time_buckets,
  );
  validateTimeBucketSeries(
    game,
    leagueName,
    "all cards",
    "UTC total",
    totals.utc_time_buckets,
  );

  if (
    sumTimeBucketSeries(totals.local_time_buckets) !== totals.observed_events ||
    sumTimeBucketSeries(totals.utc_time_buckets) !== totals.observed_events ||
    validateLocationSeries(game, leagueName, "all cards", totals.locations) !==
      totals.located_events
  ) {
    throw new Error(
      `Inconsistent drop-context totals for ${game}/${leagueName}`,
    );
  }
}

export function validateDropContextPayload(
  game,
  leagueName,
  payload,
  cardNames,
) {
  if (
    !payload ||
    payload.found !== true ||
    payload.game !== game ||
    payload.league !== leagueName ||
    payload.bucket_minutes !== 15 ||
    !payload.totals ||
    !Array.isArray(payload.cards)
  ) {
    throw new Error(
      `Unexpected drop-context payload for ${game}/${leagueName}`,
    );
  }

  validateDropContextTotals(game, leagueName, payload.totals);

  const expectedCardNames = new Set(cardNames);
  const contextCardNames = new Set();
  let observedEvents = 0;
  let locatedEvents = 0;
  const locationTotals = new Map();
  for (const card of payload.cards) {
    validateDropContextCard(game, leagueName, card);
    if (contextCardNames.has(card.name) || !expectedCardNames.has(card.name)) {
      throw new Error(
        `Unexpected drop-context card for ${game}/${leagueName}/${card.name}`,
      );
    }
    contextCardNames.add(card.name);
    observedEvents += card.observed_events;
    locatedEvents += card.located_events;
    for (const location of card.locations) {
      locationTotals.set(
        location.name,
        (locationTotals.get(location.name) ?? 0) + location.count,
      );
    }
  }

  const publishedLocationTotals = new Map(
    payload.totals.locations.map((location) => [location.name, location.count]),
  );
  if (
    observedEvents !== payload.totals.observed_events ||
    locatedEvents !== payload.totals.located_events ||
    [...locationTotals].some(
      ([name, count]) => count > (publishedLocationTotals.get(name) ?? 0),
    )
  ) {
    throw new Error(
      `Drop-context card totals do not match league totals for ${game}/${leagueName}`,
    );
  }
}

export function buildDropContextDocuments(payload) {
  const timeBucketsByCard = {};
  const locationsByCard = {};
  const locatedEventsByCard = {};

  for (const card of payload.cards) {
    const localTimeBuckets = Object.fromEntries(
      card.local_time_buckets
        .filter((bucket) => bucket.count > 0)
        .map((bucket) => [String(bucket.minute), bucket.count]),
    );
    const utcTimeBuckets = Object.fromEntries(
      card.utc_time_buckets
        .filter((bucket) => bucket.count > 0)
        .map((bucket) => [String(bucket.minute), bucket.count]),
    );
    const locations = Object.fromEntries(
      card.locations
        .filter((location) => location.count > 0)
        .map((location) => [location.name, location.count]),
    );

    if (
      Object.keys(utcTimeBuckets).length > 0 ||
      Object.keys(localTimeBuckets).length > 0
    ) {
      timeBucketsByCard[card.name] = {
        utc: utcTimeBuckets,
        local: localTimeBuckets,
      };
    }
    if (Object.keys(locations).length > 0) {
      locationsByCard[card.name] = locations;
    }
    locatedEventsByCard[card.name] = card.located_events;
  }

  const localTimeBucketTotals = Object.fromEntries(
    payload.totals.local_time_buckets
      .filter((bucket) => bucket.count > 0)
      .map((bucket) => [String(bucket.minute), bucket.count]),
  );
  const utcTimeBucketTotals = Object.fromEntries(
    payload.totals.utc_time_buckets
      .filter((bucket) => bucket.count > 0)
      .map((bucket) => [String(bucket.minute), bucket.count]),
  );
  const locationTotals = Object.fromEntries(
    payload.totals.locations
      .filter((location) => location.count > 0)
      .map((location) => [location.name, location.count]),
  );

  return {
    observedTotal: payload.totals.observed_events,
    locatedTotal: payload.totals.located_events,
    timeBucketTotals: {
      utc: utcTimeBucketTotals,
      local: localTimeBucketTotals,
    },
    locationTotals,
    locatedEventsByCard,
    timeBucketsByCard,
    locationsByCard,
  };
}
