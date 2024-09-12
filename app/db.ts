import { drizzle } from "drizzle-orm/postgres-js";
import { asc, desc, eq } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { chat, user } from "@/schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(email: string) {
  return await db.select().from(user).where(eq(user.email, email));
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(user).values({ email, password: hash });
}

export async function createMessage({
  id,
  messages,
  author,
}: {
  id: string;
  messages: any;
  author: string;
}) {
  const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

  if (selectedChats.length > 0) {
    return await db
      .update(chat)
      .set({
        messages: JSON.stringify(messages),
      })
      .where(eq(chat.id, id));
  }

  return await db.insert(chat).values({
    id,
    createdAt: new Date(),
    messages: JSON.stringify(messages),
    author,
  });
}

export async function getChatsByUser({ email }: { email: string }) {
  return await db
    .select()
    .from(chat)
    .where(eq(chat.author, email))
    .orderBy(desc(chat.createdAt));
}

export async function getChatById({ id }: { id: string }) {
  const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
  return selectedChat;
}
