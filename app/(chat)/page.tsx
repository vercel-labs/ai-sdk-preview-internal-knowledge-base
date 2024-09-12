import { Chat } from "@/components/chat";
import { generateId } from "ai";

export default async function Page() {
  return <Chat id={generateId()} initialMessages={[]} />;
}
