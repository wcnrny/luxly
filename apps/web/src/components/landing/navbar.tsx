import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            L
          </div>
          Luxly
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#community"
            className="hover:text-primary transition-colors"
          >
            Community
          </Link>
          <Link
            href="https://docs.luxly.site"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {session && session?.user ? (
            <Button asChild size="sm" className="gap-2" variant={"ghost"}>
              <Link href="/workspaces">Go to workspaces</Link>
            </Button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium hover:underline hidden sm:block"
            >
              Sign In
            </Link>
          )}
          <Button asChild size="sm" className="gap-2">
            <Link href="https://github.com/yourusername/luxly">
              <Github className="w-4 h-4" /> Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
