export function getCookieValue(
  setCookieHeader: string | string[] | undefined,
  cookieName: string
): string | null {
  if (!setCookieHeader) return null;

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : (setCookieHeader as string).split(", ");

  for (const cookie of cookies) {
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.split(";")[0].split("=")[1];
    }
  }
  return null;
}

export const getFullIconUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("https")) return path;
  return `https://s3.luxly.local/luxly-bucket/${path}`;
};

import { FileText, FileCode, FileImage, File, FileJson } from "lucide-react";

// 1. Dosya Boyutu Formatlayıcı
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// 2. MimeType'a göre İkon ve Renk Seçici
export function getFileIcon(mimeType: string) {
  if (mimeType.includes("pdf"))
    return { icon: FileText, color: "text-red-500", bg: "bg-red-500/10" };
  if (mimeType.includes("word") || mimeType.includes("document"))
    return { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" };
  if (mimeType.includes("image"))
    return {
      icon: FileImage,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    };
  if (mimeType.includes("json") || mimeType.includes("csv"))
    return { icon: FileJson, color: "text-green-500", bg: "bg-green-500/10" };
  if (mimeType.includes("text"))
    return { icon: FileCode, color: "text-orange-500", bg: "bg-orange-500/10" };

  return { icon: File, color: "text-gray-500", bg: "bg-gray-500/10" };
}
