import { Chat } from "@/components/chat";
import { generateId } from "ai";
import { auth } from "@/app/(auth)/auth";

export default async function Page() {
  const session = await auth();
  return <Chat id={generateId()} initialMessages={[]} session={session} />;
}
