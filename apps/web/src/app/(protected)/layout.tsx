import { Navbar } from "@/components/navbar";

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactElement>;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col mx-auto max-w-7xl">{children}</main>
    </div>
  );
}
