import type { Message } from "ai";
import {
  pgTable,
  varchar,
  text,
  real,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

export const UserTable = pgTable("User", {
  email: varchar("email", { length: 64 }).primaryKey().notNull(),
  password: varchar("password", { length: 64 }),
});

export const ChatTable = pgTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  author: varchar("author", { length: 64 })
    .notNull()
    .references(() => UserTable.email),
});

export const ChunkTable = pgTable("Chunk", {
  id: text("id").primaryKey().notNull(),
  filePath: text("filePath").notNull(),
  content: text("content").notNull(),
  embedding: real("embedding").array().notNull(),
});

export type Chat = Omit<typeof ChatTable.$inferSelect, "messages"> & {
  messages: Message[];
};
export type ChatInsert = Omit<typeof ChatTable.$inferSelect, "createdAt">;

export type Chunk = typeof ChunkTable.$inferSelect;
export type ChunkInsert = typeof ChunkTable.$inferInsert;

export type User = Omit<typeof UserTable.$inferSelect, "password">;
export type UserSelectAll = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;
