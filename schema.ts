import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, text, timestamp, json } from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  email: varchar("email", { length: 64 }).primaryKey().notNull(),
  password: varchar("password", { length: 64 }),
});

export const chat = pgTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  author: varchar("author", { length: 64 })
    .notNull()
    .references(() => user.email),
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};
