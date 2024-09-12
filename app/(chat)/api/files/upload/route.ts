import { auth } from "@/app/auth";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  let session = await auth();

  if (!session) {
    return Response.redirect("/login");
  }

  const { user } = session;

  if (!user) {
    return Response.redirect("/login");
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  const blob = await put(`${user.email}/${filename}`, request.body, {
    access: "public",
  });

  return Response.json(blob);
}
