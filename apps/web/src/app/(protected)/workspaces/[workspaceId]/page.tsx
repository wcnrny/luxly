"use client";

import { Plus, FileText, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "@/utils/api";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Document } from "@luxly/prisma";
import { useModal } from "@/utils/modal-store";

import { DocumentCard } from "./_components/document-card"; // Yeni oluşturduğun component

export default function WorkspaceDocumentsPage() {
  const { workspaceId } = useParams();
  const { data: session, isPending, isRefetching } = authClient.useSession();
  const { onOpen } = useModal();

  const {
    data: documents,
    isLoading,
    error,
  } = useQuery<Document[]>({
    queryKey: ["fetch-documents", workspaceId],
    queryFn: async () => {
      const res = await fetchFromApi<{ documents: Document[] }>({
        method: "GET",
        path: `workspaces/${workspaceId}/documents`,
      });

      return res.documents || [];
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
  const hasDocuments = documents && documents.length > 0;
  if (error) {
    toast.error(`Something gone wrong. Check the console for more details.`);
    return (
      <>
        <h1>Something bad happened!</h1>
        <p>We don&apos;t know what happened but here we are.</p>
      </>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Documents
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 bg-background/50"
            />
          </div>
          <Button
            className="primary-gradient text-white font-medium shadow-lg shadow-primary/20 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              onOpen("create-document", {
                workspaceId,
                accessToken: session?.session.token,
              });
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> New Document
          </Button>
        </div>
      </div>

      {!hasDocuments ? (
        <div className="flex-1 w-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/30 p-12 text-center hover:bg-card/50 hover:border-primary/20 transition-all duration-300">
          <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 border border-border">
            <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <h3 className="text-lg font-semibold text-foreground">
            No documents created
          </h3>
          <p className="text-muted-foreground max-w-sm text-center mt-2 mb-8 text-sm">
            You haven&apos;t created any documents yet. Start by creating a new
            one to get started with your project.
          </p>

          <Button
            variant="outline"
            className="border-border bg-background hover:bg-muted font-medium"
            onClick={(e) => {
              e.preventDefault();
              onOpen("create-document", {
                workspaceId,
                accessToken: session?.session.token,
              });
            }}
          >
            Create your first document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-500 pb-10">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
