export function validateReferenceCards(cards, leagueName) {
  if (!Array.isArray(cards)) {
    throw new Error(`Invalid reference card payload for ${leagueName}`);
  }

  for (const [index, card] of cards.entries()) {
    if (
      !card ||
      typeof card !== "object" ||
      typeof card.name !== "string" ||
      (card.weight !== null && typeof card.weight !== "number") ||
      (card.is_disabled !== undefined &&
        typeof card.is_disabled !== "boolean") ||
      typeof card.from_boss !== "boolean"
    ) {
      throw new Error(
        `Invalid reference card row for ${leagueName} at index ${index}`,
      );
    }
  }
}
