export function getColorForClass(className: string): string {
  switch (className) {
    case "-default":
      return "rgb(127,127,127)";
    case "-normal":
      return "rgb(200,200,200)";
    case "-magic":
      return "rgb(136,136,255)";
    case "-rare":
      return "rgb(255,255,119)";
    case "-unique":
      return "rgb(175,96,37)";
    case "-gem":
      return "rgb(27,162,155)";
    case "-currency":
      return "rgb(170,158,130)";
    case "-augmented":
      return "rgb(136,136,255)";
    case "-crafted":
      return "oklch(79.8% 0.1058 283.7)";
    case "-corrupted":
      return "rgb(210,0,0)";
    case "-fractured":
      return "oklch(66% 0.0696 91.1)";
    case "-fire":
      return "oklch(42.3% 0.1734 29.2)";
    case "-cold":
      return "oklch(49.2% 0.09 250.1)";
    case "-lightning":
      return "oklch(88.7% 0.1821 95.3)";
    case "-chaos":
      return "oklch(57.8% 0.2258 348.3)";
    case "-life":
      return "oklch(55% 0.2257 29.2)";
    case "-mana":
      return "oklch(56% 0.19 278.3)";
    default:
      return "rgb(200,200,200)";
  }
}
