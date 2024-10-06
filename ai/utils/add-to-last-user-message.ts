import type { LanguageModelV1CallOptions } from "ai";
import type { LanguageModelV1TextPart } from "@ai-sdk/provider";

export function addToLastUserMessage({
  text,
  params,
}: {
  text: LanguageModelV1TextPart[];
  params: LanguageModelV1CallOptions;
}): LanguageModelV1CallOptions {
  const { prompt, ...rest } = params;

  const lastMessage = prompt.at(-1);

  if (lastMessage?.role !== "user") {
    return params;
  }

  return {
    ...rest,
    prompt: [
      ...prompt.slice(0, -1),
      {
        ...lastMessage,
        content: [...lastMessage.content, ...text],
      },
    ],
  };
}
