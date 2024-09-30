"use server";

import { createUser, getUser } from "@/drizzle/query/user";
import { signIn } from "./auth";

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed";
}

export const login = async (
  data: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    return { status: "success" };
  } catch {
    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists";
}

export const register = async (
  data: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const user = await getUser(email);

  if (user) {
    return { status: "user_exists" };
  } else {
    await createUser(email, password);
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { status: "success" };
  }
};
