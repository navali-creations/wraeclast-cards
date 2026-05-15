import fs from "node:fs";
import { converter, oklch } from "culori";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toRgb = converter("rgb");

const inputPath = "src/index.css";
const outputPath = "src/index.rgb.css";
const css = fs.readFileSync(inputPath, "utf8");

const converted = css.replace(
  /oklch\(\s*([0-9.]+)%\s+([0-9.]+)\s+([0-9.]+)\s*\)/g,
  (match, lightness, chroma, hue) => {
    const rgb = toRgb(
      oklch({
        l: Number(lightness) / 100,
        c: Number(chroma),
        h: Number(hue),
      }),
    );

    if (!rgb) {
      return match;
    }

    const r = Math.round(clamp(rgb.r, 0, 1) * 255);
    const g = Math.round(clamp(rgb.g, 0, 1) * 255);
    const b = Math.round(clamp(rgb.b, 0, 1) * 255);

    return `rgb(${r} ${g} ${b})`;
  },
);

fs.writeFileSync(outputPath, converted);
console.log(`Generated ${outputPath}`);
