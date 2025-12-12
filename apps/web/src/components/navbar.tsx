"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn utility
import { Profile } from "./profile"; // Senin profil bileşenin
import { useSession } from "next-auth/react";
import { Search } from "lucide-react"; // İkon
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/workspaces", label: "Workspaces" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/workspaces"
            className="font-bold text-xl tracking-tight flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              L
            </div>
            Luxly
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href || pathname.startsWith(link.href)
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex w-64 h-9 items-center justify-between text-muted-foreground bg-muted/50"
            onClick={() => alert("Command Palette (Cmd+K) yakında gelecek!")} // İleride buraya fonksiyon bağlarsın
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="text-xs">Search documents...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* User Profile */}
          {session && <Profile session={session} />}
        </div>
      </div>
    </header>
  );
}
