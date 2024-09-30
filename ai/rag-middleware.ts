import type { LanguageModelV1TextPart } from "@ai-sdk/provider";
import {
  cosineSimilarity,
  embed,
  generateObject,
  generateText,
  type Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
} from "ai";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { getChunksByFilePaths } from "@/drizzle/query/chunk";
import { registry } from "./setup-registry";

// schema for validating the custom provider metadata
const selectionSchema = z.object({
  files: z.object({
    selection: z.array(z.string()),
  }),
});

export const ragMiddleware: LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const session = await auth();
    if (!session) return params; // no user session

    const { prompt: messages, providerMetadata } = params;
    // validate the provider metadata with Zod:
    const { success, data } = selectionSchema.safeParse(providerMetadata);
    if (!success) {
      return params; // no files selected
    }

    const recentMessage = messages.pop();
    if (!recentMessage) {
      return params; // no message
    }

    if (recentMessage.role !== "user") {
      messages.push(recentMessage);
      return params; // last message did not come from the user
    }

    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");

    // Classify the user prompt as whether it requires more context or not
    const { object: classification } = await generateObject({
      // fast model for classification:
      model: registry.languageModel("openai:gpt-4o-mini-structured"),
      output: "enum",
      enum: ["question", "statement", "other"],
      system: "classify the user message as a question, statement, or other",
      prompt: lastUserMessageContent,
    });

    // only use RAG for questions
    if (classification !== "question") {
      messages.push(recentMessage);
      return params;
    }

    // Use hypothetical document embeddings:
    const { text: hypotheticalAnswer } = await generateText({
      // fast model for generating hypothetical answer:
      model: registry.languageModel("openai:gpt-4o-mini-structured"),
      system: "Answer the users question:",
      prompt: lastUserMessageContent,
    });

    // Embed the hypothetical answer
    const { embedding: hypotheticalAnswerEmbedding } = await embed({
      model: registry.textEmbeddingModel("openai:text-embedding-3-small"),
      value: hypotheticalAnswer,
    });

    // find relevant chunks based on the selection
    const chunksBySelection = await getChunksByFilePaths({
      filePaths: data.files.selection.map(
        (path) => `${session.user?.email}/${path}`,
      ),
    });

    const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(
        hypotheticalAnswerEmbedding,
        chunk.embedding,
      ),
    }));

    // rank the chunks by similarity and take the top K
    chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity);
    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);

    // add the chunks to the last user message
    messages.push({
      role: "user",
      content: [
        ...recentMessage.content,
        {
          type: "text",
          text: "Here is some relevant information that you can use to answer the question:",
        },
        ...topKChunks.map(
          (chunk) =>
            ({
              type: "text",
              text: chunk.content,
            }) as LanguageModelV1TextPart,
        ),
      ],
    });

    return { ...params, prompt: messages };
  },
};
