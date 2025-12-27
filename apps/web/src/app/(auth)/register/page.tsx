import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import { Rocket, Code2, Github, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | Luxly",
  description: "Create your new account.",
};

export default function RegisterPage() {
  return (
    <div className="w-full relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* --- SOL TARAF (VIZYON & DAVET) --- */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r overflow-hidden">
        {/* Grid Deseni */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Logo */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mr-2">
            L
          </div>
          Luxly
        </div>

        {/* ORTA KISIM: Avantajlar */}
        <div className="relative z-20 flex flex-1 flex-col justify-center">
          <div className="space-y-6 max-w-sm">
            <h2 className="text-3xl font-bold tracking-tight text-white/90">
              Join the open <br /> revolution.
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white">
                  <Rocket className="h-4 w-4" />
                </div>
                <span>Deploy in seconds, scale forever</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white">
                  <Code2 className="h-4 w-4" />
                </div>
                <span>Full access to source code</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white">
                  <Globe className="h-4 w-4" />
                </div>
                <span>Join a global community</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Manifesto */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2 border-l-2 border-white/10 pl-4">
            <p className="text-md text-muted-foreground italic">
              &ldquo;The best software is built together. By joining Luxly, you
              are not just using a tool, you are shaping the future of
              collaboration.&rdquo;
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
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to get started
            </p>
          </div>

          {/* Form Bileşeni */}
          <RegisterForm />

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
