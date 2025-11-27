import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    access_token: string & DefaultSession;
  }

  interface JWT {
    access_token: string & DefaultJWT;
  }
}
