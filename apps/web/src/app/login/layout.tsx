import { Logo } from "@/components/logo";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="h-16 p-4">
        <Logo />
      </div>
      <main className="h-[calc(100vh-4rem)]">{children}</main>
    </>
  );
}
