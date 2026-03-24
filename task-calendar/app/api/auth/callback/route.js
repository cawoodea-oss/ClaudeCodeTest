import { NextResponse } from "next/server";
import { getTokensFromCode } from "@/lib/google-calendar";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  try {
    const tokens = await getTokensFromCode(code);
    
    const response = NextResponse.json({ success: true, tokens });
    
    // Set secure httpOnly cookie for access token
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      path: "/",
    });

    // Set secure httpOnly cookie for refresh token if available
    if (tokens.refresh_token) {
      response.cookies.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json(
      { error: "Failed to exchange authorization code", details: error.message },
      { status: 500 }
    );
  }
}
