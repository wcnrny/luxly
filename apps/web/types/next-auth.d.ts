import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
  interface User {
    accessToken: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT token objesine eklediklerimiz
   */
  interface JWT {
    accessToken: string;
    role: string;
    error?: "RefreshAccessTokenError";
  }
}
