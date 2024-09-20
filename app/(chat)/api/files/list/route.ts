import { auth } from "@/app/(auth)/auth";
import { list } from "@vercel/blob";

export async function GET() {
  let session = await auth();

  if (!session) {
    const { blobs } = await list({ prefix: "guest@vercel.com" });

    return Response.json(
      blobs
        .map((blob) => ({
          ...blob,
          pathname: blob.pathname.replace(`guest@vercel.com/`, ""),
        }))
        .filter((blob) => blob.pathname !== ""),
    );
  }

  const { user } = session;

  if (!user) {
    return Response.redirect("/login");
  }

  const { blobs } = await list({ prefix: user.email! });

  return Response.json(
    blobs.map((blob) => ({
      ...blob,
      pathname: blob.pathname.replace(`${user.email}/`, ""),
    })),
  );
}
