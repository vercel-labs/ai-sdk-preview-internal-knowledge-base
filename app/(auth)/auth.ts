import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUserWithPassword } from "@/drizzle/query/user";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await getUserWithPassword(credentials.email as string);
        if (!user) return null;

        const passwordsMatch = await compare(
          credentials.password as string,
          user.password!,
        );
        if (passwordsMatch) {
          return { email: user.email };
        }

        return null;
      },
    }),
  ],
});
