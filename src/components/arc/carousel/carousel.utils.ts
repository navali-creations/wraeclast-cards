export const CAROUSEL_SLOP = 6;
export const CAROUSEL_FLICK_VELOCITY = 360;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
