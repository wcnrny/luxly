import { Button } from "@/components/ui/button";
import { Github, Heart, Terminal, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export function CommunitySection() {
  return (
    <section id="community" className="container py-24 sm:py-32">
      <div className="relative rounded-3xl bg-muted/30 border overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 sm:p-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background text-primary shadow-sm">
                <Heart className="w-3 h-3 mr-2 fill-current" /> 100% Open Source
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built by the Community,
                <br />
                <span className="text-muted-foreground">
                  For the Community.
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto lg:mx-0">
                Luxly is completely transparent. Inspect the code, self-host it,
                or contribute to its development. No hidden fees, no lock-in.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <Link
                  href="https://github.com/yourusername/luxly"
                  target="_blank"
                >
                  <Github className="w-4 h-4" /> Star on GitHub
                </Link>
              </Button>

              {/* Docs Link Added Here */}
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 rounded-full"
                asChild
              >
                <Link href="https://docs.luxly.site" target="_blank">
                  <BookOpen className="w-4 h-4" /> Read Docs
                </Link>
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="gap-2 rounded-full"
                asChild
              >
                <Link href="https://discord.gg/yourserver" target="_blank">
                  <Users className="w-4 h-4" /> Join Discord
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t flex items-center justify-center lg:justify-start gap-8 text-sm">
              <div>
                <div className="font-bold text-2xl">MIT</div>
                <div className="text-muted-foreground">License</div>
              </div>
              <div>
                <div className="font-bold text-2xl">20+</div>
                <div className="text-muted-foreground">Contributors</div>
              </div>
              <div>
                <div className="font-bold text-2xl">500+</div>
                <div className="text-muted-foreground">Stars</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-full">
            <div className="rounded-xl bg-[#1e1e1e] border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-2 text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <Terminal className="w-3 h-3" /> bash — 80x24
                </div>
              </div>

              <div className="p-6 font-mono text-sm space-y-4">
                <div className="flex">
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-blue-400 mr-2">~</span>
                  <span className="text-gray-300 typing-effect">
                    git clone https://github.com/wcnrny/luxly.git
                  </span>
                </div>
                <div className="text-gray-500">
                  Cloning into &apos;luxly&apos;...
                </div>

                <div className="flex">
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-blue-400 mr-2">~</span>
                  <span className="text-gray-300">
                    cd luxly && docker compose up -d
                  </span>
                </div>
                <div className="text-gray-500">
                  [+] Running 8/8 <br />⠿ Network luxly_net
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-green-500">Created</span>
                  <br />⠿ Container luxly-db &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-bucket{" "}
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-valkey{" "}
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-traefik{" "}
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-api &nbsp;&nbsp;&nbsp;
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-web &nbsp;&nbsp;&nbsp;
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-worker{" "}
                  <span className="text-green-500">Started</span>
                  <br />⠿ Container luxly-collab{" "}
                  <span className="text-green-500">Started</span>
                </div>

                <div className="flex">
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-blue-400 mr-2">~</span>
                  <span className="text-gray-300 animate-pulse">_</span>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-600 rounded-xl opacity-20 blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
