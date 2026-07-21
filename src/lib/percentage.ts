const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
});

const signedPercentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
  signDisplay: "exceptZero",
});

export function formatPercentage(value: number): string {
  return percentageFormatter.format(value);
}

export function formatSignedPercentage(value: number): string {
  return signedPercentageFormatter.format(value);
}
