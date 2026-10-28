"use client";

import { Children, type CSSProperties, isValidElement, useId } from "react";
import { CarouselControls } from "./CarouselControls";
import { CarouselSlide } from "./CarouselSlide";
import styles from "./carousel.module.css";
import { type CarouselProps, defaultSlideLabel } from "./carousel.types";
import { useCarouselSlideMotion } from "./carousel-motion";
import { useCarouselController } from "./useCarouselController";

export type { CarouselProps } from "./carousel.types";
export { useCarouselSlideMotion };

export function Carousel({
  label,
  children,
  index: controlledIndex,
  defaultIndex = 0,
  onIndexChange,
  slideSize = "min(80cqw, 340px)",
  slideLabel = defaultSlideLabel,
  interval,
  autoplay = false,
  smallScreenFadeOnly = false,
  className,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const last = Math.max(0, count - 1);
  const looping = count > 1;
  const leadingCloneIndexes = looping ? [last - 1, last] : [];
  const trailingCloneIndexes = looping ? [0, 1] : [];
  const trackSlides = looping
    ? [
        ...leadingCloneIndexes.map((logicalIndex, cloneIndex) => ({
          clone: true,
          cloneKey: `before-${cloneIndex}`,
          logicalIndex,
          slide: slides[logicalIndex],
        })),
        ...slides.map((slide, logicalIndex) => ({
          clone: false,
          cloneKey: "",
          logicalIndex,
          slide,
        })),
        ...trailingCloneIndexes.map((logicalIndex, cloneIndex) => ({
          clone: true,
          cloneKey: `after-${cloneIndex}`,
          logicalIndex,
          slide: slides[logicalIndex],
        })),
      ]
    : slides.map((slide, logicalIndex) => ({
        clone: false,
        cloneKey: "",
        logicalIndex,
        slide,
      }));
  const id = useId();
  const controller = useCarouselController({
    autoplay,
    controlledIndex,
    count,
    defaultIndex,
    interval,
    onIndexChange,
    slideLabel,
  });
  const rootStyle = {
    "--carousel-slide": slideSize,
    "--carousel-start": controller.visualPosition,
  } as CSSProperties;

  return (
    <section
      ref={controller.rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={rootStyle}
      data-small-screen-fade-only={smallScreenFadeOnly || undefined}
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={controller.handleKeyDown}
      onFocus={controller.handleFocus}
      onBlur={controller.handleBlur}
    >
      <fieldset
        ref={controller.viewportRef}
        className={styles.viewport}
        aria-label="Slides"
        data-dragging={controller.dragging || undefined}
        onPointerDown={controller.handlePointerDown}
        onPointerMove={controller.handlePointerMove}
        onPointerUp={controller.handlePointerUp}
        onPointerCancel={controller.handlePointerCancel}
        onPointerEnter={controller.handlePointerEnter}
        onPointerLeave={controller.handlePointerLeave}
        onClickCapture={controller.handleClickCapture}
        onDragStart={controller.handleDragStart}
      >
        <div ref={controller.trackRef} className={styles.track}>
          {trackSlides.map(
            ({ clone, cloneKey, logicalIndex, slide }, position) => (
              <CarouselSlide
                key={
                  clone
                    ? `clone-${cloneKey}`
                    : isValidElement(slide) && slide.key != null
                      ? slide.key
                      : `slide-${slideLabel(logicalIndex, count)}`
                }
                id={`${id}-slide-${position}`}
                index={position}
                progress={controller.progress}
                direction={controller.direction}
                active={position === controller.visualPosition}
                clone={clone}
                label={slideLabel(logicalIndex, count)}
              >
                {slide}
              </CarouselSlide>
            ),
          )}
        </div>
      </fieldset>
      {count > 1 && (
        <CarouselControls
          canRotate={controller.canRotate}
          count={count}
          drains={controller.drains}
          firstRealPosition={controller.firstRealPosition}
          id={id}
          index={controller.index}
          onNext={controller.next}
          onPrevious={controller.previous}
          onSelect={controller.selectLogicalIndex}
          onToggleRotation={controller.toggleRotation}
          playing={controller.playing}
          playRef={controller.playRef}
          progress={controller.progress}
          reduced={controller.reduced}
          setTabRef={controller.setTabRef}
          slideLabel={slideLabel}
        />
      )}
      <span
        className={styles.visuallyHidden}
        aria-live="polite"
        aria-atomic="true"
      >
        {controller.announcement}
      </span>
    </section>
  );
}
