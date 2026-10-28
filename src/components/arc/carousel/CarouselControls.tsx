import type { MotionValue } from "motion/react";
import { AnimatePresence, m } from "motion/react";
import type { RefObject } from "react";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { motionTokens } from "../motion-tokens";
import { CarouselIndicator } from "./CarouselIndicator";
import styles from "./carousel.module.css";
import type { CarouselSlideLabel } from "./carousel.types";

export function CarouselControls({
  canRotate,
  count,
  drains,
  firstRealPosition,
  id,
  index,
  onNext,
  onPrevious,
  onSelect,
  onToggleRotation,
  playing,
  playRef,
  progress,
  reduced,
  setTabRef,
  slideLabel,
}: {
  canRotate: boolean;
  count: number;
  drains: MotionValue<number>[];
  firstRealPosition: number;
  id: string;
  index: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  onToggleRotation: () => void;
  playing: boolean;
  playRef: RefObject<HTMLButtonElement | null>;
  progress: MotionValue<number>;
  reduced: boolean;
  setTabRef: (index: number, node: HTMLButtonElement | null) => void;
  slideLabel: CarouselSlideLabel;
}) {
  return (
    <div className={styles.controls}>
      {canRotate && (
        <button
          ref={playRef}
          type="button"
          className={styles.control}
          aria-label={playing ? "Pause slide rotation" : "Start slide rotation"}
          onClick={onToggleRotation}
        >
          <span className={styles.iconSlot}>
            <AnimatePresence initial={false}>
              <m.span
                key={playing ? "pause" : "play"}
                className={styles.icon}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.6,
                        filter: `blur(${motionTokens.blur.subtle}px)`,
                      }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduced
                    ? {
                        opacity: 0,
                        transition: {
                          duration: motionTokens.duration.instant,
                        },
                      }
                    : {
                        opacity: 0,
                        scale: 0.6,
                        filter: `blur(${motionTokens.blur.subtle}px)`,
                        transition: {
                          duration: motionTokens.duration.fast,
                          ease: [...motionTokens.ease.standard],
                        },
                      }
                }
                transition={
                  reduced
                    ? { duration: motionTokens.duration.instant }
                    : {
                        ...motionTokens.spring.snappy,
                        opacity: {
                          duration: motionTokens.duration.fast,
                          ease: [...motionTokens.ease.enter],
                        },
                        filter: {
                          duration: motionTokens.duration.fast,
                          ease: [...motionTokens.ease.enter],
                        },
                      }
                }
              >
                {playing ? (
                  <FiPause size={15} aria-hidden="true" />
                ) : (
                  <FiPlay size={15} aria-hidden="true" />
                )}
              </m.span>
            </AnimatePresence>
          </span>
        </button>
      )}
      <div className={styles.tabs} role="tablist" aria-label="Choose a slide">
        {drains.map((drain, indicatorIndex) => {
          const label = slideLabel(indicatorIndex, count);
          return (
            <CarouselIndicator
              key={label}
              index={indicatorIndex}
              firstRealPosition={firstRealPosition}
              progress={progress}
              drain={drain}
              selected={indicatorIndex === index}
              label={label}
              controls={`${id}-slide-${indicatorIndex + firstRealPosition}`}
              count={count}
              tabRef={(node) => setTabRef(indicatorIndex, node)}
              onSelect={() => onSelect(indicatorIndex)}
            />
          );
        })}
      </div>
      <div className={styles.arrows}>
        <button
          type="button"
          className={styles.control}
          aria-label="Previous slide"
          onClick={onPrevious}
        >
          <FiChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.control}
          aria-label="Next slide"
          onClick={onNext}
        >
          <FiChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
