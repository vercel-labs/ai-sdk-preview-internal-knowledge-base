import { auth } from "@/app/auth";
import { getChatsByUser } from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  let session = await auth();

  if (!session || !session.user) {
    return NextResponse.redirect("/login");
  }

  const chats = await getChatsByUser({ email: session.user.email! });
  return NextResponse.json(chats);
}
