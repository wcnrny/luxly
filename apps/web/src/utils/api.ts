import { env } from "./env";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return env.NEXT_PUBLIC_API_URL;
  }
  if (env.INTERNAL_API_URL) {
    return env.INTERNAL_API_URL;
  }
  return env.NEXT_PUBLIC_API_URL;
};

export const API_URL = getBaseUrl();
