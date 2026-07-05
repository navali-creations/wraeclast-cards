export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function asTrueFlag(value: unknown): true | undefined {
  return value === true || value === "true" ? true : undefined;
}
