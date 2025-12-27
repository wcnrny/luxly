import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
      {/* Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted/50 mb-6 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Luxly v0. is Live
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          Transform Teamwork <br className="hidden md:block" />
          <span className="text-primary">Into Art.</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The open-source workspace designed for modern teams. Manage documents,
          collaborate in real-time, and accelerate your projects without limits.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="h-12 px-8 text-base gap-2" asChild>
            <Link href="/register">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base gap-2"
            asChild
          >
            <Link href="https://docs.luxly.site">
              <PlayCircle className="w-4 h-4" /> How it Works
            </Link>
          </Button>
        </div>

        {/* Social Proof Text */}
        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Free & Open Source
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Self-Hostable
          </div>
        </div>
      </div>

      {/* Hero Image / Dashboard Preview */}
      <div className="container mt-16">
        <div className="relative rounded-xl border bg-background/50 backdrop-blur shadow-2xl overflow-hidden aspect-video ring-1 ring-inset ring-foreground/10">
          {/* Place your dashboard screenshot here later */}
          <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
            <span className="text-muted-foreground font-mono text-sm">
              Dashboard Screenshot Preview
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
