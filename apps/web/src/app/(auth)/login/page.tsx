import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Zap, ShieldCheck, Github, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Luxly",
  description: "Login to your account.",
};

export default function LoginPage() {
  return (
    /* 👇 DÜZELTME BURADA: 'container' sınıfını kaldırdık, 'w-full' ekledik */
    <div className="w-full relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* --- SOL TARAF (VIZYON & ÖZELLİKLER) --- */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r overflow-hidden">
        {/* 1. KATMAN: Arkaplan Grid Deseni (Boşluğu öldüren dokunuş) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Logo */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mr-2">
            L
          </div>
          Luxly
        </div>

        {/* ORTA KISIM: Boşluğu dolduran özellik listesi */}
        <div className="relative z-20 flex flex-1 flex-col justify-center">
          <div className="space-y-6 max-w-sm">
            <h2 className="text-3xl font-bold tracking-tight text-white/90">
              Collaboration, <br /> redefined.
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white">
                  <Globe className="h-4 w-4" />
                </div>
                <span>100% Open Source & Self-hostable</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white">
                  <Zap className="h-4 w-4" />
                </div>
                {/* Go yerine Bun ve NestJS vurgusu yaptık */}
                <span>Powered by Bun & NestJS architecture</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Enterprise-grade security</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ALT KISIM: Manifesto */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2 border-l-2 border-white/10 pl-4">
            <p className="text-md text-muted-foreground italic">
              &ldquo;We believe software should be transparent. Inspect the
              code, deploy it on your infrastructure, and own your data
              completely.&rdquo;
            </p>
            <footer className="text-sm font-semibold text-white/80 flex items-center gap-2 mt-2">
              <Github className="w-4 h-4" /> Luxly Open Source Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* --- SAĞ TARAF (FORM) --- */}
      <div className="lg:p-8 flex items-center justify-center h-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <LoginForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
