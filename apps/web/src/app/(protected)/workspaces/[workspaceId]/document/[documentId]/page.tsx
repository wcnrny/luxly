"use client";

import { CollaborativeEditor } from "@/components/workspaces/CollaborativeEditor";
import { fetchFromApi } from "@/utils/api";
import { Document } from "@luxly/prisma";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function DocumentPage() {
  const { workspaceId, documentId } = useParams();
  const { data: session, isPending, isRefetching } = authClient.useSession();

  const { data: document, isLoading } = useQuery<Document>({
    queryKey: ["fetch-document", workspaceId, documentId],
    queryFn: async () => {
      const res = await fetchFromApi<{ document: Document }>({
        method: "GET",
        path: `workspaces/${workspaceId}/documents/${documentId}`,
      });
      // Ekran görüntüsüne göre yapı: jsonData.document doğru yer.
      console.log(res.document);
      return res.document;
    },
    enabled: (!isPending || !isRefetching) && !!session?.session.token,
  });

  if (isPending || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!document || !document.id) {
    return <div>Document not found or invalid data.</div>;
  }

  return (
    <>
      <h1>Editor</h1>
      {/* 2. ÇÖZÜM: Token'ı buradan string olarak zorluyoruz */}
      <CollaborativeEditor
        doc={document}
        token={session?.session.token || "anonymous"}
      />
    </>
  );
}
