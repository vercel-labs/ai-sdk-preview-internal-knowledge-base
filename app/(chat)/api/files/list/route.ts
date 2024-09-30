import { list } from "@vercel/blob";
import { auth } from "@/app/(auth)/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.redirect("/login");
  }

  const { user } = session;

  if (!user) {
    return Response.redirect("/login");
  }

  const { blobs } = await list({ prefix: user.email! });

  return Response.json(
    blobs.map((blob) => ({
      pathname: blob.pathname.replace(`${user.email}/`, ""),
      url: blob.url,
    })),
  );
}
