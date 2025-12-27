import {
  Zap,
  ShieldCheck,
  Users,
  Puzzle,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export function BentoGridSection() {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          One Platform. Limitless Power.
        </h2>
        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">
          Ditch the scattered tools. Luxly consolidates all the muscles your
          team needs into a single body.
        </p>
      </div>

      {/* --- BENTO GRID IZGARASI (Düzeltilmiş) --- */}
      {/*
        grid-template-areas mantığı:
        "collaboration collaboration analytics speed"
        "collaboration collaboration analytics security"
        "integrations integrations integrations integrations"
      */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[350px] md:grid-rows-[350px_350px_auto]"
        style={
          {
            // Mobilde normal grid, masaüstünde grid-areas kullanıyoruz.
            gridTemplateAreas: `
            'collaboration collaboration analytics speed'
            'collaboration collaboration analytics security'
            'integrations integrations integrations integrations'
          `,
          } as React.CSSProperties
        }
      >
        {/* Kutu 1: REAL-TIME (Sol Büyük Alan) */}
        <div
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card/50 p-8 text-card-foreground transition-all duration-300 hover:border-primary/50"
          style={{ gridArea: "collaboration" }}
        >
          <div className="relative z-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Real-time Collaboration</h3>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Work on the same document with your team, simultaneously, with
              zero latency. Watch cursors dance.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px] transition-colors group-hover:bg-blue-500/30" />
        </div>

        {/* Kutu 2: ANALYTICS (Sağ Dikey Alan) */}
        <div
          className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card/50 p-8 text-card-foreground transition-all duration-300 hover:border-primary/50"
          style={{ gridArea: "analytics" }}
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 transition-transform group-hover:scale-110">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h3 className="mb-3 text-2xl font-bold">Analytics</h3>
          <p className="mb-8 text-sm text-muted-foreground">
            Track project velocity and team performance with visual charts.
          </p>
          <div className="flex flex-1 items-end justify-between gap-2 px-2 pb-4">
            <div className="h-[40%] w-full rounded-t-md bg-green-500/20 transition-all duration-500 group-hover:h-[60%]" />
            <div className="h-[70%] w-full rounded-t-md bg-green-500/40 transition-all duration-500 delay-75 group-hover:h-[90%]" />
            <div className="h-[50%] w-full rounded-t-md bg-green-500/30 transition-all duration-500 delay-100 group-hover:h-[40%]" />
          </div>
        </div>

        {/* Kutu 3: SPEED (Sağ Üst Kare) */}
        <div
          className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card/50 p-8 text-card-foreground transition-all duration-300 hover:border-primary/50"
          style={{ gridArea: "speed" }}
        >
          <div className="mb-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-500 transition-transform group-hover:rotate-12">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Built on Redis architecture for{" "}
              <span className="font-semibold text-foreground">ms</span> response
              times.
            </p>
          </div>
        </div>

        {/* Kutu 4: SECURITY (Sağ Alt Kare) */}
        <div
          className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card/50 p-8 text-card-foreground transition-all duration-300 hover:border-primary/50"
          style={{ gridArea: "security" }}
        >
          <div className="mb-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 transition-transform group-hover:scale-110">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-bold">Secure</h3>
            <p className="text-sm text-muted-foreground">
              End-to-end encryption and automated daily backups.
            </p>
          </div>
        </div>

        {/* Kutu 5: INTEGRATIONS (En Alt Geniş Alan) */}
        <div
          className="group flex flex-col items-center justify-between gap-6 rounded-3xl border bg-gradient-to-br from-card/50 to-muted/50 p-8 transition-all duration-300 hover:border-primary/50 md:flex-row"
          style={{ gridArea: "integrations" }}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-background p-3 shadow-sm">
              <Puzzle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-1 text-xl font-bold">Seamless Integrations</h3>
              <p className="text-sm text-muted-foreground">
                Fully compatible with Slack, GitHub, and Jira.
              </p>
            </div>
          </div>

          <Link
            href="/integrations"
            className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
