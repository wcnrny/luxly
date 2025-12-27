import { WorkspaceHeader } from "./_components/workspace-header";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <WorkspaceHeader workspaceId={(await params).workspaceId} />

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-6 md:px-10 py-8">
        {children}
      </main>
    </div>
  );
}
