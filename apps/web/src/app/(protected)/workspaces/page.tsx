import { auth } from "@/auth";
import { WorkspaceList } from "@/components/workspace-list";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  return (
    <section className="py-8 h-full flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
        <p className="text-muted-foreground">
          Manage your team workspaces and projects.
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <WorkspaceList session={session} />
      </div>
    </section>
  );
}
