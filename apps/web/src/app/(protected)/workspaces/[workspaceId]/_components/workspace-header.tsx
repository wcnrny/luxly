"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Settings, Users, FileText, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Profile } from "@/components/profile";
import useSWR from "swr";
import { fetchFromApi } from "@/utils/api";
import { Workspace, WorkspaceRole } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";

interface WorkspaceHeaderProps {
  workspaceId: string;
}

type WorkspaceApiResponse = Workspace & {
  currentUserRole: WorkspaceRole;
};

const fetcher = async (path: string) => {
  const res = await fetchFromApi<WorkspaceApiResponse>({ path, method: "GET" });
  return res;
};

export function WorkspaceHeader({ workspaceId }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  if (!session && !isPending) {
    redirect("/login");
  }
  const baseUrl = `/workspaces/${workspaceId}`;

  const { data } = useSWR<WorkspaceApiResponse>(
    session?.session.token ? `workspaces/${workspaceId}` : null,
    (url) => fetcher(url),
    {
      refreshInterval: 2000,
      revalidateOnFocus: true,
    }
  );
  if (!data) {
    return null;
  }
  const currentRole = data.currentUserRole ?? "MEMBER";
  const currentName = data.name;
  const navItems = [
    {
      label: "Overview",
      href: baseUrl,
      icon: FileText,
      show: true,
      exact: true,
    },
    {
      label: "Members",
      href: `${baseUrl}/members`,
      icon: Users,
      show: currentRole !== "MEMBER", // Canlı role göre gizle/göster
      exact: false,
    },
    {
      label: "Settings",
      href: `${baseUrl}/settings`,
      icon: Settings,
      show: currentRole === "OWNER", // Canlı role göre gizle/göster
      exact: false,
    },
  ];

  return (
    <div className="border-b border-border bg-background sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
        {/* SOL: Logo ve Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link
            href="/workspaces"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">L</span>
            </div>
            <span className="font-bold hidden md:block">Luxly</span>
          </Link>

          <span className="text-muted-foreground/30 text-2xl font-light">
            /
          </span>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
              {currentName.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-sm">{currentName}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
              {currentRole}
            </Badge>
          </div>
        </div>

        {/* SAĞ: Arama ve Profil */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-9 w-64 pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-input transition-all"
            />
          </div>

          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-5 h-5" />
          </Button>

          <Profile session={session!.session} user={session!.user} />
        </div>
      </div>

      {/* ALT: Tablar */}
      <div className="px-6 flex items-center gap-6 overflow-x-auto">
        {navItems.map((item) => {
          if (!item.show) return null;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 h-12 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
