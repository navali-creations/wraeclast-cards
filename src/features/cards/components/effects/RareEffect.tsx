import type { CardEffectProps } from "./types";

const BAR_WIDTH = 0.5;
const SPACE = 500;

export function RareEffect({
  mousePos,
  isHovered,
  posX,
  posY,
}: CardEffectProps) {
  return (
    <>
      {/* Rainbow gradient base */}
      <div
        className="absolute inset-0 rounded-[14.55px/10.5px] transition-opacity duration-300 pointer-events-none"
        style={{
          zIndex: 21,
          opacity: isHovered ? 0.15 : 0,
          clipPath: "inset(2.8% 4% round 2.55% / 1.5%)",
          backgroundImage: `
            repeating-linear-gradient(
              55deg,
              rgb(255, 161, 158) ${SPACE * 1}px,
              rgb(85, 178, 255) ${SPACE * 2}px,
              rgb(255, 199, 146) ${SPACE * 3}px,
              rgb(253, 170, 240) ${SPACE * 5}px,
              rgb(148, 241, 255) ${SPACE * 6}px,
              rgb(255, 161, 158) ${SPACE * 7}px
            )
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "800% 800%",
          backgroundPosition: `${(posX - 50) * -0.5 + 50}% ${(posY - 50) * -0.5 + 50}%`,
          mixBlendMode: "color-dodge",
        }}
      />

      {/* First diagonal criss-cross (45deg) */}
      <div
        className="absolute inset-0 rounded-[14.55px/10.5px] transition-opacity duration-300 pointer-events-none"
        style={{
          zIndex: 22,
          opacity: isHovered ? 0.05 : 0,
          clipPath: "inset(2.8% 4% round 2.55% / 1.5%)",
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent 0%,
              transparent ${BAR_WIDTH * 4}%,
              rgba(255, 255, 255, 0.8) ${BAR_WIDTH * 4}%,
              rgba(255, 255, 255, 1) ${BAR_WIDTH * 5}%,
              rgba(255, 255, 255, 0.8) ${BAR_WIDTH * 6}%,
              transparent ${BAR_WIDTH * 6}%,
              transparent ${BAR_WIDTH * 10}%
            )
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "400% 400%",
          backgroundPosition: `${(posX - 50) * 0.3 + 50}% ${(posY - 50) * 0.3 + 50}%`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Second diagonal criss-cross (-45deg) */}
      <div
        className="absolute inset-0 rounded-[14.55px/10.5px] transition-opacity duration-300 pointer-events-none"
        style={{
          zIndex: 23,
          opacity: isHovered ? 0.05 : 0,
          clipPath: "inset(2.8% 4% round 2.55% / 1.5%)",
          backgroundImage: `
            repeating-linear-gradient(
              -45deg,
              transparent 0%,
              transparent ${BAR_WIDTH * 4}%,
              rgba(255, 255, 255, 0.8) ${BAR_WIDTH * 4}%,
              rgba(255, 255, 255, 1) ${BAR_WIDTH * 5}%,
              rgba(255, 255, 255, 0.8) ${BAR_WIDTH * 6}%,
              transparent ${BAR_WIDTH * 6}%,
              transparent ${BAR_WIDTH * 10}%
            )
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "400% 400%",
          backgroundPosition: `${(posX - 50) * 0.3 + 50}% ${(posY - 50) * 0.3 + 50}%`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Radial glow following cursor */}
      <div
        className="absolute inset-0 rounded-[14.55px/10.5px] transition-opacity duration-300 pointer-events-none"
        style={{
          zIndex: 24,
          opacity: isHovered ? 1.0 : 0,
          background: `radial-gradient(
            circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(0, 0, 0, 0) 50%
          )`,
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
