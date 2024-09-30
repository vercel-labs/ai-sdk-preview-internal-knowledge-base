import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";
import { registry } from "./setup-registry";

export const customModel = wrapLanguageModel({
  model: registry.languageModel("openai:gpt-4o"),
  middleware: ragMiddleware,
});
