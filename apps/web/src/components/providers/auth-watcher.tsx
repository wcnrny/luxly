"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function AuthWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ redirectTo: "/login" });
    }
  }, [session]);

  return null;
}
