import { z } from "zod";

export const serverConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // --- API VARIABLES ---
  DATABASE_URL: z.url(),
  API_PORT: z.coerce.number().default(3001),
  API_SECRET_PEPPER: z.string().nonempty(),

  // --- JWT VARIABLES ---
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  // --- VALKEY VARIABLES ---
  VALKEY_HOST: z.string().min(1),
  VALKEY_PORT: z.coerce.number().default(6379),

  // --- WORKER VARIABLES ---
  OPENAI_KEY: z.string().min(8),

  // --- S3 BUCKET VARIABLES ---
  S3_REGION: z.string().default("us-east-1"),
  S3_ENDPOINT: z.url(),
  S3_BUCKET_NAME: z.string().min(1),
  S3_ACCESS_KEY: z.string().nonempty().min(3),
  S3_SECRET_KEY: z.string().nonempty().min(3),
  AUTH_SECRET: z.string().nonempty(),
});

export const clientConfigSchema = z.object({
  // --- WEB (NEXT.JS) VARIABLES ---
  INTERNAL_API_URL: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().nonempty(),
});

export const appConfigSchema = clientConfigSchema.extend(
  serverConfigSchema.shape
);

export type AppConfig = z.infer<typeof appConfigSchema>;
export type ClientConfig = z.infer<typeof clientConfigSchema>;
