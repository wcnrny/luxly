"use client";

import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { env } from "@/utils/env";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB (backend PayloadTooLargeException threshold)
const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "") || "";

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const { data: session } = authClient.useSession();

  async function onSubmit(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    ev.preventDefault();
    if (!session) {
      setError("oc");
      return;
    }
    setError("");
    setStatus("");

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Lütfen bir dosya seçin.");
      return;
    }

    if (!/(application\/pdf|video\/mp4)$/.test(file.type)) {
      setError("Sadece PDF veya MP4 dosyaları kabul edilir.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Dosya 50MB sınırını aşıyor.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    const endpoint = `${baseUrl}/upload/`;

    try {
      setUploading(true);
      setStatus("Yükleniyor...");
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session.session.token}`,
        },
      });

      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");
      const payload = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        setError(
          typeof payload === "string"
            ? payload || `Yükleme hatası (status ${res.status})`
            : (payload?.message as string) ||
                `Yükleme hatası (status ${res.status})`
        );
        setStatus("");
        return;
      }
      setStatus("Yükleme tamamlandı.");
      console.log("Upload response", payload);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Beklenmeyen hata oluştu.";
      setError(message);
      setStatus("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Dosya Yükle</h1>
      <form>
        <input
          type="file"
          ref={fileRef}
          accept=".pdf,video/mp4"
          style={{ display: "block", marginBottom: "1rem" }}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={uploading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {uploading ? "Yükleniyor..." : "Yükle"}
        </button>
      </form>
      {status && <p style={{ color: "green", marginTop: "1rem" }}>{status}</p>}
      {error && (
        <p style={{ color: "crimson", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  );
}
