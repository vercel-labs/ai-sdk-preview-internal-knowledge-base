import { auth } from "@/app/(auth)/auth";
import { getChatsByUser } from "@/app/db";

export async function GET() {
  let session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const chats = await getChatsByUser({ email: session.user.email! });
  return Response.json(chats);
}
