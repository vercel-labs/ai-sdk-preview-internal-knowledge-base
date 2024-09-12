import { auth } from "@/app/auth";
import { list } from "@vercel/blob";
import { openai } from "@ai-sdk/openai";
import { getPdfContentFromUrl } from "@/utils/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {
  Experimental_LanguageModelV1Middleware,
  generateObject,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

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

    // @ts-expect-error provider metadata is not typed
    const { files } = providerMetadata;
    const { selection } = files;

    const { blobs } = await list({
      mode: "folded",
      prefix: `${session.user?.email}/`,
    });

    const selectedBlobs = blobs.filter((blob) =>
      selection.includes(blob.pathname.replace(`${session.user?.email}/`, "")),
    );

    const documents = await Promise.all(
      selectedBlobs.map(async (blob) => {
        const { downloadUrl } = blob;
        return await getPdfContentFromUrl(downloadUrl);
      }),
    );

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const chunkedDocuments = await textSplitter.createDocuments(documents);
    const vectorStore = await MemoryVectorStore.fromDocuments(
      chunkedDocuments,
      new OpenAIEmbeddings(),
    );

    const chunks = await vectorStore.similaritySearch(userPromptContent);

    // @ts-expect-error todo: will need to expose this type
    const recentMessageWithChunks: LanguageModelV1Message = {
      role: "user",
      content: [
        ...recentMessage.content,
        ...chunks.map((chunk) => ({
          type: "text",
          text: chunk.pageContent,
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
