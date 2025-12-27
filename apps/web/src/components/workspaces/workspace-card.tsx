"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  MoreHorizontal,
  CalendarDays,
  ShieldCheck,
  Trash,
  Edit,
  Users,
  Files,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Prisma } from "@luxly/prisma";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/utils/modal-store";
import { useRouter } from "next/navigation";
import { getFullIconUrl } from "@/utils/helpers";

interface WorkspaceCardProps {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  createdAt: Date | string;
  role?: "OWNER" | "MEMBER" | "ADMIN";
  members: Prisma.WorkspaceMemberGetPayload<{
    include: {
      user: {
        select: {
          avatarUrl: true;
          id: true;
          firstName: true;
          lastName: true;
          username: true;
        };
      };
    };
  }>[];
}

export function WorkspaceCard({
  id,
  name,
  description,
  iconUrl,
  createdAt,
  role = "OWNER",
  members,
}: WorkspaceCardProps) {
  const fallbackColor = "from-indigo-500 via-purple-500 to-pink-500";
  const { onOpen } = useModal();
  const router = useRouter();

  const MAX_VISIBLE = 3;
  const visibleMembers = members.slice(0, MAX_VISIBLE);
  const remainingCount = members.length - MAX_VISIBLE;

  return (
    <div className="group relative flex flex-col justify-between rounded-[32px] border border-border bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-[360px]">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "relative h-20 w-20 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3",
            !iconUrl && `bg-gradient-to-br ${fallbackColor}`
          )}
        >
          {iconUrl ? (
            <Image
              src={getFullIconUrl(iconUrl)}
              alt={name}
              fill
              className="object-cover"
              unoptimized={true}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:shadow-2xl hover:shadow-primary/10 hover:bg-muted rounded-full"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpen("invite-people", { workspaceId: id });
                  }}
                >
                  <UserPlus className="mr-2" />
                  Invite
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/workspaces/${id}/members`);
                  }}
                >
                  <Users className="mr-2" />
                  Members
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Files className="mr-2" />
                  Documents
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Edit className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary text-xs px-3 py-1 mt-1"
          >
            {role === "OWNER" && <ShieldCheck className="w-3 h-3 mr-1.5" />}
            {role}
          </Badge>
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-card-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-medium">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>
              Created{" "}
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 font-light">
          {description ||
            "No description provided. Start adding documents to describe this workspace."}
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex -space-x-3 pl-1">
          {visibleMembers.map((member, i) => (
            <div
              key={i}
              className="relative h-9 w-9 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs text-muted-foreground ring-1 ring-border transition-all duration-300 hover:z-10 hover:scale-110 hover:shadow-lg"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-muted cursor-pointer">
                    {member.user.avatarUrl ? (
                      <Image
                        src={getFullIconUrl(member.user.avatarUrl)}
                        alt={member.user.username}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="font-semibold text-[10px]">
                        {member.user.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{member.user.firstName || member.user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {member.role.toLowerCase()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <div className="relative h-9 w-9 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground ring-1 ring-border transition-all duration-300 hover:z-10 hover:scale-110 hover:bg-primary hover:text-primary-foreground cursor-pointer">
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent>{remainingCount} more members</TooltipContent>
            </Tooltip>
          )}
        </div>

        <Link href={`/workspaces/${id}`} className="z-10">
          <Button
            size="default"
            className="rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold shadow-lg"
          >
            Open Workspace <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
