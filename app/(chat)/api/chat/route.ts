import { convertToCoreMessages, streamText } from "ai";
import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createChatMessage } from "@/drizzle/query/chat";

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json();

  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await streamText({
    model: customModel,
    system:
      "you are a friendly assistant! keep your responses concise and helpful.",
    messages: convertToCoreMessages(messages),
    experimental_providerMetadata: {
      files: {
        selection: selectedFilePathnames,
      },
    },
    onFinish: async ({ text }) => {
      await createChatMessage({
        id,
        messages: [...messages, { role: "assistant", content: text }],
        author: session.user?.email ?? "",
      });
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}
