import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("google_access_token");

  return Response.json({
    authenticated: !!accessToken,
  });
}
