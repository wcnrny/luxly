"use client";

import { useModal } from "@/utils/modal-store";
import { Plus } from "lucide-react";

export function CreateWorkspaceCard() {
  const { onOpen } = useModal();

  return (
    <button
      onClick={() => onOpen("create-workspace")}
      className="group relative flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-muted-foreground/25 bg-transparent p-6 transition-all hover:border-primary/50 hover:bg-muted/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
        <Plus className="h-6 w-6" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Create Workspace</h3>
        <p className="text-sm text-muted-foreground">Start a new project</p>
      </div>
    </button>
  );
}
