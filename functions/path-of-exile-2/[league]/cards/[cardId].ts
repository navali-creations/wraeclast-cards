import { handleCardPage } from "../../../_shared/cardPage";

export const onRequest: PagesFunction<unknown, "league" | "cardId"> = (
  context,
) => handleCardPage(context, "poe2");
