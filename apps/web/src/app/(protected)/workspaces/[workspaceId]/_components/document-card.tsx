"use client";

import { formatDistanceToNow } from "date-fns";
import {
  MoreVertical,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  Edit,
  Trash,
  ExternalLink,
} from "lucide-react";
import { Document } from "@luxly/prisma";
import { formatBytes, getFileIcon } from "@/utils/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface DocumentCardProps {
  doc: Document;
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const { icon: Icon, color, bg } = getFileIcon(doc.mimeType);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 h-[200px]">
      {/* --- Header: İkon ve Menü --- */}
      <div className="flex items-start justify-between">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${bg} ${color}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Download className="mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- Body: Başlık ve Meta --- */}
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-base truncate pr-2" title={doc.title}>
          {doc.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{formatBytes(doc.size)}</span>
          <span className="text-muted-foreground/40">•</span>
          <span className="whitespace-nowrap">
            {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* --- Footer: Status Göstergesi --- */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        {doc.status === "COMPLETED" && (
          <Badge
            variant="secondary"
            className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-[10px] px-2.5 py-0.5 h-6 gap-1.5 border-0 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </Badge>
        )}

        {(doc.status === "PROCESSING" || doc.status === "PENDING") && (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-[10px] px-2.5 py-0.5 h-6 gap-1.5 border-0 font-medium"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
          </Badge>
        )}

        {doc.status === "FAILED" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="destructive"
                  className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-[10px] px-2.5 py-0.5 h-6 gap-1.5 border-0 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Failed
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{doc.errorMessage || "Unknown error occurred"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div>
          <Button asChild variant={"default"}>
            <Link href={`/workspaces/${doc.workspaceId}/document/${doc.id}`}>
              <ExternalLink />
              Edit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
