import { FetchOptions } from "../../types/api.type";
import { env } from "./env";

export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return env.INTERNAL_API_URL || "https://api.luxly.local";
  } else {
    return env.NEXT_PUBLIC_API_URL;
  }
};

export const getBucketUrl = () => {
  if (typeof window === "undefined") {
    return `https://s3.luxly.local/luxly-bucket`;
  } else return `${env.NEXT_S3_ENDPOINT}/${env.NEXT_S3_BUCKET_NAME}`;
};

export const API_URL = getBaseUrl();

export async function fetchFromApi<T>(options: FetchOptions): Promise<T> {
  let endpoint: string;
  if ("path" in options && options.path) {
    endpoint = `${getBaseUrl()}/${options.path}`;
  } else {
    endpoint = options.url!;
  }
  const res = await fetch(`${endpoint}`, {
    method: options.method,
    body: (options.body && typeof options.body === "object"
      ? JSON.stringify(options.body)
      : options.body) as BodyInit,
    headers: options.headers,
    credentials: "include",
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`An error has occured: ${errText}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  const text = await res.text();

  if (!text) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    console.error(e);
    return text as unknown as T;
  }
}
