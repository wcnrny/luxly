import { clientConfigSchema } from "@luxly/config";
import { z } from "zod";

const envVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  INTERNAL_API_URL: process.env.INTERNAL_API_URL,
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  NEXT_S3_ENDPOINT: process.env.S3_ENDPOINT,
  NEXT_S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};

const parsed = clientConfigSchema.safeParse(envVars);

if (!parsed.success) {
  console.error("Frontend env error: ", z.treeifyError(parsed.error));
  throw new Error("FRONTEND_ENV_ERROR");
}

export const env = parsed.data;
