"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Loader2,
  Search,
  Users,
  Rocket,
  HelpCircle,
  Sparkles,
} from "lucide-react"; // Yeni ikonlar eklendi
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Button eklendi

import { WorkspaceCard } from "@/components/workspaces/workspace-card";
import { CreateWorkspaceCard } from "@/components/workspaces/create-workspace-card";
import { fetchFromApi } from "@/utils/api";
import { Prisma } from "@luxly/prisma";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

interface Workspace {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  createdAt: string;
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

export default function WorkspacesPage() {
  const { data: session, isPending, isRefetching } = authClient.useSession();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchWorkspaces() {
      if (isPending || isRefetching) return;

      try {
        const data = await fetchFromApi<Workspace[]>({
          path: `workspaces`,
          method: "GET",
        });
        setWorkspaces(data);
      } catch (error) {
        console.error("Failed to fetch workspaces", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkspaces();
  }, [session, isPending, isRefetching]);

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isPending || isRefetching || isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-10 md:py-16 mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gradient inline-block">
              My Workspaces
            </h1>
            <p className="text-muted-foreground text-lg font-light">
              Manage your team projects and collaborations.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workspaces..."
              className="pl-10 h-12 rounded-2xl bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 items-start">
          <CreateWorkspaceCard />

          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              id={workspace.id}
              name={workspace.name}
              description={workspace.description}
              iconUrl={workspace.iconUrl}
              createdAt={workspace.createdAt}
              members={workspace.members}
            />
          ))}

          {workspaces.length > 0 && filteredWorkspaces.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No workspaces found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>

        <div className="mt-20 space-y-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-card via-muted/50 to-primary/5 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 group">
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity" />

            <div className="space-y-2 relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start text-foreground">
                <Sparkles className="w-6 h-6 text-primary" />
                Ready to expand?
              </h3>
              <p className="text-muted-foreground max-w-md text-lg font-light">
                Invite your team members to collaborate and unlock the full
                potential of Luxly.
              </p>
            </div>

            <div className="relative z-10 flex gap-4">
              <Button
                variant="outline"
                className="rounded-full border-border bg-background hover:bg-muted h-12 px-6 text-foreground"
              >
                <HelpCircle className="w-4 h-4 mr-2" /> How it works
              </Button>

              <Button className="rounded-full h-12 px-8 primary-gradient hover:opacity-90 transition-opacity text-white font-semibold shadow-lg shadow-primary/20">
                <Users className="w-4 h-4 mr-2" /> Invite Team
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Luxly</span>
              <span>© 2025</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="https://docs.luxly.site"
                className="hover:text-primary transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/support"
                className="hover:text-primary transition-colors"
              >
                Support
              </Link>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-foreground">
                  All systems normal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
