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
import { getLastUserMessageText } from "./utils/get-last-user-message-text";
import { addToLastUserMessage } from "./utils/add-to-last-user-message";

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
    // validate the provider metadata with Zod:
    const { success, data } = selectionSchema.safeParse(
      params.providerMetadata,
    );
    if (!success) {
      return params; // no files selected
    }

    const lastUserMessageContent = getLastUserMessageText({
      prompt: params.prompt,
    });
    if (!lastUserMessageContent) {
      return params; // no message
    }

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
    const topKChunks = chunksWithSimilarity.slice(0, 10);
    const text: LanguageModelV1TextPart[] = [
      {
        type: "text",
        text: "Here is some relevant information that you can use to answer the question:",
      },
      ...topKChunks.map(
        (chunk) =>
          ({ type: "text", text: chunk.content }) as LanguageModelV1TextPart,
      ),
    ];

    // add the chunks to the last user message
    return addToLastUserMessage({ text, params });
  },
};
