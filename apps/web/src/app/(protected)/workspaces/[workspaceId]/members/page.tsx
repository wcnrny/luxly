"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { useModal } from "@/utils/modal-store";
import { fetchFromApi, getBaseUrl } from "@/utils/api";

import { WorkspaceMember, getColumns } from "../_components/columns";
import { DataTable } from "../_components/data-table";
import { redirect, useParams } from "next/navigation";

const fetcher = async (path: string) => {
  const res = await fetchFromApi<{
    members: WorkspaceMember[];
    currentUserRole: string;
  }>({ path, method: "GET" });
  return res;
};

export default function WorkspaceMembersPage() {
  const { data: authData } = authClient.useSession();
  const { onOpen } = useModal();
  const params = useParams();
  const { session, user } = authData ?? redirect("/asdasd");

  const { data, error, isLoading, mutate } = useSWR<{
    members: WorkspaceMember[];
    currentUserRole: string;
  }>(
    session?.token ? `workspaces/${params.workspaceId}/members` : null,
    (url) => fetcher(url),
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  const members = data?.members || [];
  const currentUserRole =
    members.find((m) => m.user.id === user.id)?.role ?? "MEMBER";

  const handleRoleChange = async (
    memberId: string,
    newRole: "ADMIN" | "MEMBER"
  ) => {
    if (!data) return;

    const updatedMembers = members.map((m) =>
      m.id === memberId ? { ...m, role: newRole } : m
    );

    mutate({ members: updatedMembers, currentUserRole }, false);

    try {
      const res = await fetch(
        `${getBaseUrl()}/workspaces/${params.workspaceId}/members/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Role updated");

      mutate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
      mutate();
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    if (!data) return;

    const updatedMembers = {
      members: members.filter((m) => m.id !== memberId),
      currentUserRole,
    };
    mutate(updatedMembers, false);

    try {
      const res = await fetch(
        `${getBaseUrl()}/workspaces/${params.workspaceId}/members/${memberId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session?.token}` },
        }
      );

      if (!res.ok) throw new Error();
      toast.success("Member removed");
      mutate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove member");
      mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Failed to load members.</div>;
  }

  const columns = getColumns({
    onRoleChange: handleRoleChange,
    onRemoveMember: handleRemoveMember,
    currentUserRole: currentUserRole as "OWNER" | "ADMIN" | "MEMBER",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage access and roles for your team.
          </p>
        </div>

        <Button
          onClick={() =>
            onOpen("invite-people", { workspaceId: params.workspaceId })
          }
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <DataTable columns={columns} data={data?.members || []} />
    </div>
  );
}
