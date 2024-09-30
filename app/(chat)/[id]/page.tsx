import { notFound } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/chat";
import { getChatById } from "@/drizzle/query/chat";

export default async function Page({ params }: { params: { id: string } }) {
  const chat = await getChatById({ id: params.id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (chat.author !== session?.user?.email) {
    notFound();
  }

  return (
    <PreviewChat
      id={chat.id}
      initialMessages={chat.messages}
      session={session}
    />
  );
}
