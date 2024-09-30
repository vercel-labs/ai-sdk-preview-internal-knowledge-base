import { desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { ChatTable, type Chat, type ChatInsert } from "@/drizzle/schema";

export async function createChatMessage({ id, messages, author }: ChatInsert) {
  const existingChat = await getChatById({ id });

  if (existingChat) {
    return await db
      .update(ChatTable)
      .set({
        messages: JSON.stringify(messages),
      })
      .where(eq(ChatTable.id, id));
  }

  return await db.insert(ChatTable).values({
    id,
    createdAt: new Date(),
    messages: JSON.stringify(messages),
    author,
  });
}

export async function getChatById({
  id,
}: {
  id: string;
}): Promise<Chat | undefined> {
  return (await db.query.ChatTable.findFirst({
    where: eq(ChatTable.id, id),
  })) as unknown as Chat | undefined;
}

export async function getChatsByUser({
  email,
}: {
  email: string;
}): Promise<Chat[] | undefined> {
  return (await db.query.ChatTable.findMany({
    where: eq(ChatTable.author, email),
    orderBy: desc(ChatTable.createdAt),
  })) as unknown as Chat[] | undefined;
}
