import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return new Response("Server is missing REVALIDATE_SECRET environment variable", { status: 500 });
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  // Flush all Next.js data caches for the entire site
  revalidatePath("/", "layout");
  
  return Response.json({ revalidated: true, now: Date.now() });
}
