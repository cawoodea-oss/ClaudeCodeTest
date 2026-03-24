import { getTokensFromCode } from "@/lib/google-calendar";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  try {
    const tokens = await getTokensFromCode(code);
    
    // Store tokens in session/cookie or send to client
    // For now, we'll return them and the client will store them
    const response = Response.json({ success: true, tokens });
    
    // Set secure httpOnly cookie
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
    });

    if (tokens.refresh_token) {
      response.cookies.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return Response.json(
      { error: "Failed to exchange authorization code" },
      { status: 500 }
    );
  }
}
