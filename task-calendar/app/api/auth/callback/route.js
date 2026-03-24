import { NextResponse } from "next/server";
import { getTokensFromCode } from "@/lib/google-calendar";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const tokens = await getTokensFromCode(code);
    
    // Create redirect response back to home page
    const response = NextResponse.redirect(new URL("/", request.url));
    
    // Set secure httpOnly cookie for access token
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      path: "/",
    });

    // Set secure httpOnly cookie for refresh token if available
    if (tokens.refresh_token) {
      response.cookies.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.redirect(
      new URL(`/?error=auth_failed&details=${error.message}`, request.url)
    );
  }
}
