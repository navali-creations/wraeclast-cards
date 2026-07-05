export function getNameSuggestions(
  names: string[],
  searchTerm: string,
  limit = 8,
): string[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return [];

  const unique = [...new Set(names)];
  const startsWith = unique.filter((name) =>
    name.toLowerCase().startsWith(normalizedSearch),
  );
  const includes = unique.filter(
    (name) =>
      !name.toLowerCase().startsWith(normalizedSearch) &&
      name.toLowerCase().includes(normalizedSearch),
  );

  return [...startsWith, ...includes].slice(0, limit);
}
