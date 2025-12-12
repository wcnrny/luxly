"use client";
import { API_URL } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from "next-auth";
import { WorkspaceCard } from "./workspace-card";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

import { type Workspace } from "@luxly/prisma";
import { ArrowUpRightIcon, FolderIcon, Plus } from "lucide-react";
import { useModal } from "@/utils/modal-store";

const docs_placeholder = "https://docs.luxly.site/workspaces";

export function WorkspaceList({ session }: { session: Session }) {
  const router = useRouter();
  const { onOpen } = useModal();
  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);
  const { data, isLoading, error } = useQuery<Workspace[]>({
    queryKey: ["documents"],
    queryFn: () =>
      fetch(`${API_URL}/workspaces`, {
        method: "GET",
        headers: { Authorization: `Bearer ${session!.accessToken}` },
      }).then((res) => res.json()),
  });
  if (isLoading) {
    return <>Loading....</>;
  }
  if (error) {
    return <>Error: {error.message}</>;
  }
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center min-h-[500px] w-full border-2 border-dashed rounded-xl bg-muted/5 animate-in fade-in-50">
        <Empty>
          <EmptyHeader>
            <div className="flex items-center justify-center mb-6">
              <div className="p-6 bg-background rounded-full shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-800">
                <FolderIcon className="w-12 h-12 text-muted-foreground/50" />
              </div>
            </div>

            <EmptyTitle className="text-2xl font-bold tracking-tight">
              No Workspaces Yet
            </EmptyTitle>

            <EmptyDescription className="max-w-md mx-auto mt-4 text-base leading-normal text-muted-foreground">
              You haven&apos;t created any workspaces yet. Get started by
              creating your first workspace to collaborate with your team.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent className="mt-8">
            <Button
              size="lg"
              className="gap-2 h-11 px-8 text-md font-medium"
              onClick={() => onOpen("create-workspace")}
            >
              <Plus className="w-5 h-5" />
              Create Workspace
            </Button>
          </EmptyContent>

          <div className="mt-10">
            <Button
              variant="link"
              asChild
              className="text-muted-foreground hover:text-primary transition-colors"
              size="sm"
            >
              <a href={docs_placeholder} className="flex items-center gap-1">
                Learn how workspaces work{" "}
                <ArrowUpRightIcon className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </Empty>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 items-start mt-5 gap-4">
      {data.map((doc) => (
        <WorkspaceCard workspace={doc} key={doc.id} />
      ))}
    </div>
  );
}
