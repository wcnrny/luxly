import { JWT } from "@auth/core/jwt";
import { API_URL } from "./api";
import { redirect } from "next/navigation";
export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${token.refresh_token}`,
      },
    });
    console.log(response);

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const newSetCookie = response.headers.get("set-cookie");
    const newRefreshToken = getCookieValue(newSetCookie!, "refresh_token");

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      expiresAt: Date.now() + (refreshedTokens.expiresIn || 15 * 60 * 1000),
      refreshToken: newRefreshToken ?? token.refreshToken,
      error: null,
    };
  } catch (error) {
    console.error("Token yenileme hatası:", error);
    redirect("/login");
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export function getCookieValue(
  setCookieHeader: string | string[] | undefined,
  cookieName: string
): string | null {
  if (!setCookieHeader) return null;

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : (setCookieHeader as string).split(", ");

  for (const cookie of cookies) {
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.split(";")[0].split("=")[1];
    }
  }
  return null;
}
