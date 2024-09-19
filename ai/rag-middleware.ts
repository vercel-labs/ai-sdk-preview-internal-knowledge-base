import { auth } from "@/app/auth";
import { getChunksByFilePaths } from "@/app/db";
import { openai } from "@ai-sdk/openai";
import {
  cosineSimilarity,
  embed,
  Experimental_LanguageModelV1Middleware,
  generateObject,
  generateText,
} from "ai";

export const ragMiddleware: Experimental_LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const session = await auth();

    if (!session) return params;

    const { prompt, providerMetadata } = params;

    const recentMessage = prompt.pop();

    if (!recentMessage || recentMessage.role !== "user") return params;

    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");

    // Classify the user prompt as whether it requires more context or not
    const { object: classification } = await generateObject({
      model: openai("gpt-4o"),
      output: "enum",
      enum: ["question", "statement", "other"],
      system: "classify the user message as a question, statement, or other",
      prompt: lastUserMessageContent,
    });

    // only use RAG for questions
    if (classification !== "question") return params;

    // Use hypothetical document embeddings:
    const { text: hypotheticalAnswer } = await generateText({
      model: openai("gpt-4o"),
      system: "Answer the users question:",
      prompt: lastUserMessageContent,
    });

    // Embed the hypothetical answer
    const { embedding: hypotheticalAnswerEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: hypotheticalAnswer,
    });

    // TODO validate provider metadata with Zod, and return early if it's not valid:
    // const schema = z.object({
    //   files: z.object({
    //     selection: z.array(z.string()),
    //   }),
    // });
    const { files } = providerMetadata as any; // TODO remove any, use Zod
    const { selection }: { selection: Array<string> } = files;

    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) => `${session.user?.email}/${path}`),
    });

    const chunksWithSimilarity = chunksBySelection
      .map((chunk) => ({
        ...chunk,
        similarity: cosineSimilarity(
          hypotheticalAnswerEmbedding,
          chunk.embedding
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);

    prompt.push({
      role: "user",
      content: [
        ...recentMessage.content,
        ...topKChunks.map((chunk) => ({
          type: "text" as const,
          text: chunk.content,
        })),
      ],
    });

    return {
      ...params,
      prompt,
    };
  },
};
