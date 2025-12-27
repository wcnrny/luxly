export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
