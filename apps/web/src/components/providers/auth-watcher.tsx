"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
export default function AuthWatcher() {
  const { data: session, error } = authClient.useSession();

  useEffect(() => {
    if (error) {
      authClient.signOut({});
    }
  }, [session, error]);

  return null;
}
