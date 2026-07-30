import {
  type DivinationCardsDataSource,
  divinationCardImageUrl,
  divinationCardRarity,
  divinationCardRewardText,
  divinationCardSlug,
  type RawDivinationCard,
} from "../../../lib/divinationCards.ts";
import {
  cleanRewardHtml,
  extractRewardTags,
  getRewardSearchText,
  stripHtmlText,
} from "../cards.utils.ts";
import type { Card } from "../types/index.ts";

export function createCard(
  raw: RawDivinationCard,
  source: DivinationCardsDataSource,
): Card {
  const rewardHtml = raw.reward_html
    ? cleanRewardHtml(raw.reward_html)
    : raw.description;

  return {
    id: divinationCardSlug(raw.name),
    name: raw.name,
    imageUrl: divinationCardImageUrl(raw, source.imagesBaseUrl),
    frameUrl: source.frameUrl,
    separatorUrl: source.separatorUrl,
    flavourText: raw.flavour_html ? stripHtmlText(raw.flavour_html) : undefined,
    rewardText: divinationCardRewardText(raw),
    rewardHtml,
    rewardSearchText: getRewardSearchText(rewardHtml),
    rewardTags: extractRewardTags(raw.reward_html),
    stackSize: raw.stack_size,
    dropLocations: [],
    rarity: divinationCardRarity(raw.weight),
    weight: raw.weight,
    fromBoss: raw.from_boss ?? false,
    isDisabled: raw.is_disabled ?? false,
  };
}
