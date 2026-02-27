import { gateway, wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";

export const customModel = wrapLanguageModel({
  model: gateway("openai/gpt-4o"),
  middleware: ragMiddleware,
});
