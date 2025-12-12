/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Users } from "@luxly/prisma";
import { getCookieValue, refreshAccessToken } from "./utils/helpers";
import { env } from "@/utils/env";

type CustomUser = Users & {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        });
        if (!res.ok) {
          return null;
        }
        const user = (await res.json()) as CustomUser;
        const setCookieHeader = res.headers.get("set-cookie");
        const refreshToken = getCookieValue(setCookieHeader!, "refresh_token");
        if (!refreshToken) {
          console.error("Backend cookie set etmedi!");
          return null;
        }

        return { ...user, refreshToken };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: (user as CustomUser).accessToken,
          role: (user as CustomUser).role,
          sub: (user as CustomUser).id,
          name:
            (user as CustomUser).firstName +
            " " +
            (user as CustomUser).lastName,
          refreshToken: (user as CustomUser).refreshToken,
          expiresAt:
            Date.now() +
            ((user as CustomUser).expiresIn ?? 24 * 60 * 60 * 1000),
        };
      }
      if (Date.now() < (token as any).expiresAt - 10000) {
        return token;
      }
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.id = token.sub as string;
      }
      if (token.error) {
        (session as any).error = token.error;
      }
      return session;
    },
  },
});
