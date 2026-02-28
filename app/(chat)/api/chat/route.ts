import { customModel } from "@/ai";
import { auth } from "@/app/(auth)/auth";
import { createMessage } from "@/app/db";
import {
  convertToModelMessages,
  generateId,
  streamText,
  UIMessage,
} from "ai";

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames }: {
    id: string;
    messages: Array<UIMessage>;
    selectedFilePathnames: string[];
  } = await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: customModel,
    system:
      "you are a friendly assistant! keep your responses concise and helpful.",
    messages: modelMessages,
    providerOptions: {
      files: {
        selection: selectedFilePathnames,
      },
    },
    onFinish: async ({ text }) => {
      const assistantMessage: UIMessage = {
        id: generateId(),
        role: "assistant",
        parts: [{ type: "text", text }],
      };
      await createMessage({
        id,
        messages: [...messages, assistantMessage],
        author: session.user?.email!,
      });
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toUIMessageStreamResponse();
}
