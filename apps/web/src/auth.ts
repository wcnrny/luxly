import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Users } from "@luxly/prisma";

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res);
        if (!res.ok) {
          return null;
        }
        const user = (await res.json()) as Users & { accessToken: string };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, account }) {
      console.log({ token, trigger, session, account });
      return { ...token, access_token: account?.access_token };
    },
  },
});
