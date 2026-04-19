import { createOpenAI } from "@ai-sdk/openai";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag-middleware";

export async function getCustomModel() {
  const openai = createOpenAI({
    baseURL: "https://ai-gateway.vercel.sh/v1",
    apiKey: await getVercelOidcToken(),
  });

  return wrapLanguageModel({
    model: openai("gpt-4o"),
    middleware: ragMiddleware,
  });
}
