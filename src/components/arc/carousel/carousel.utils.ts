export const CAROUSEL_SLOP = 6;
export const CAROUSEL_FLICK_VELOCITY = 360;
const CAROUSEL_LOOP_BUFFER = 2;

export interface CarouselLoopGeometry {
  count: number;
  firstRealPosition: number;
  last: number;
  lastRealPosition: number;
  leadingCloneIndexes: number[];
  looping: boolean;
  trackLast: number;
  trailingCloneIndexes: number[];
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createCarouselLoopGeometry(
  count: number,
): CarouselLoopGeometry {
  const last = Math.max(0, count - 1);
  const looping = count > 1;
  const buffer = looping ? Math.min(CAROUSEL_LOOP_BUFFER, count) : 0;
  const firstRealPosition = buffer;
  const lastRealPosition = looping ? firstRealPosition + last : 0;

  return {
    count,
    firstRealPosition,
    last,
    lastRealPosition,
    leadingCloneIndexes: looping
      ? Array.from({ length: buffer }, (_, index) => count - buffer + index)
      : [],
    looping,
    trackLast: looping ? count + buffer * 2 - 1 : last,
    trailingCloneIndexes: looping
      ? Array.from({ length: buffer }, (_, index) => index)
      : [],
  };
}

export function carouselLogicalIndexAt(
  position: number,
  geometry: CarouselLoopGeometry,
) {
  const { count, firstRealPosition, last, looping } = geometry;
  if (!looping) return clamp(Math.round(position), 0, last);

  return (((Math.round(position) - firstRealPosition) % count) + count) % count;
}

export function normalizeCarouselPosition(
  position: number,
  geometry: CarouselLoopGeometry,
) {
  const { count, firstRealPosition, lastRealPosition, looping, trackLast } =
    geometry;
  if (!looping) return clamp(position, 0, trackLast);
  if (position < firstRealPosition) return position + count;
  if (position > lastRealPosition) return position - count;
  return position;
}

export function closestCarouselPosition(
  logicalIndex: number,
  from: number,
  geometry: CarouselLoopGeometry,
) {
  const { count, firstRealPosition, looping, trackLast } = geometry;
  const realPosition = logicalIndex + firstRealPosition;
  if (!looping) return realPosition;

  return [realPosition - count, realPosition, realPosition + count]
    .filter((position) => position >= 0 && position <= trackLast)
    .reduce((closest, position) =>
      Math.abs(position - from) < Math.abs(closest - from) ? position : closest,
    );
}

export function carouselIndicatorEmphasis(
  progress: number,
  logicalIndex: number,
  geometry: Pick<
    CarouselLoopGeometry,
    "count" | "firstRealPosition" | "looping"
  >,
) {
  const { count, firstRealPosition, looping } = geometry;
  const realPosition = logicalIndex + firstRealPosition;
  const positions = looping
    ? [realPosition - count, realPosition, realPosition + count]
    : [realPosition];
  const distance = Math.min(
    ...positions.map((position) => Math.abs(progress - position)),
  );
  return Math.max(0, 1 - distance);
}

export function projectCarouselVelocity(velocity: number, rate = 0.995) {
  return ((velocity / 1000) * rate) / (1 - rate);
}

export function rubberBand(overshoot: number, dimension: number) {
  return (overshoot * dimension * 0.55) / (dimension + 0.55 * overshoot);
}

export function removeRubberBand(distance: number, dimension: number) {
  return (distance * dimension) / (0.55 * Math.max(1, dimension - distance));
}

export function carouselVelocity(samples: [number, number][], now: number) {
  const recent = samples.filter(([time]) => now - time <= 90);
  const first = recent[0];
  const last = recent.at(-1);
  if (!first || !last || recent.length < 2 || now - last[0] > 50) return 0;

  const [firstTime, firstX] = first;
  const [lastTime, lastX] = last;
  return lastTime > firstTime
    ? (lastX - firstX) / ((lastTime - firstTime) / 1000)
    : 0;
}
