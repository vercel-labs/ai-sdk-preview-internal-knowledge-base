import { auth } from "@/app/auth";
import { openai } from "@ai-sdk/openai";
import {
  cosineSimilarity,
  embed,
  Experimental_LanguageModelV1Middleware,
  generateObject,
  generateText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";
import { getChunksByFilePaths } from "@/app/db";

const middleware: Experimental_LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const session = await auth();

    if (!session) return params;

    const { prompt, providerMetadata } = params;

    const recentMessage = prompt.pop();

    if (!recentMessage || recentMessage.role !== "user") return params;

    const userPromptContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");

    // Classify the user prompt as whether it requires more context or not

    const { object: classification } = await generateObject({
      model: openai("gpt-4o"),
      output: "enum",
      enum: ["info", "no-info"],
      system:
        "classify the user prompt as whether it requires more information or not",
      prompt: userPromptContent,
    });

    if (classification !== "info") {
      prompt.push(recentMessage);
      return { ...params, prompt };
    }

    const { text: searchPrompt } = await generateText({
      model: openai("gpt-4o"),
      system:
        "generate a prompt that you can use to search a corpus of text that uses cosine similarity to find the most relevant chunks of text based on user prompt",
      prompt: userPromptContent,
    });

    // Perform retrieval augmented generation

    const { embedding: searchPromptEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: searchPrompt,
    });

    // @ts-expect-error provider metadata is not typed
    const { files } = providerMetadata;
    const { selection }: { selection: Array<string> } = files;

    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) => `${session.user?.email}/${path}`),
    });

    const chunksWithSimilarity = chunksBySelection
      .map((chunk) => ({
        ...chunk,
        similarity: cosineSimilarity(searchPromptEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);

    // @ts-expect-error todo: will need to expose this type
    const recentMessageWithChunks: LanguageModelV1Message = {
      role: "user",
      content: [
        ...recentMessage.content,
        ...topKChunks.map((chunk) => ({
          type: "text",
          text: chunk.content,
        })),
      ],
    };

    prompt.push(recentMessageWithChunks);

    return {
      ...params,
      prompt,
    };
  },
};

export const customModel = wrapLanguageModel({
  model: openai("gpt-4o"),
  middleware,
});
