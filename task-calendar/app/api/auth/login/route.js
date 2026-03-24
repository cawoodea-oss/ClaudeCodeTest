import { getAuthUrl } from "@/lib/google-calendar";

export async function GET() {
  const authUrl = getAuthUrl();
  return Response.json({ authUrl });
}
