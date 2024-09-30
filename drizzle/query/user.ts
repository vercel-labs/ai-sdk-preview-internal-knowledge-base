import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { UserTable, type User, type UserSelectAll } from "@/drizzle/schema";

export async function getUser(email: string): Promise<User | undefined> {
  return await db.query.UserTable.findFirst({
    columns: { email: true },
    where: eq(UserTable.email, email),
  });
}

export async function getUserWithPassword(
  email: string,
): Promise<UserSelectAll | undefined> {
  return await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
}

export async function createUser(email: string, password: string) {
  const hash = hashSync(password, genSaltSync(10));
  return await db.insert(UserTable).values({ email, password: hash });
}
