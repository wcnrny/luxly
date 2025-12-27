/* eslint-disable react/no-children-prop */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Github } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";

// Zod Schema (English Messages)
const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters." }),
});

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const res = await authClient.signIn.email({
          ...value,
        });

        if (res?.error) {
          toast.error("Login Failed", {
            description:
              "Invalid email or password. Please check your credentials.",
          });
          setIsLoading(false);
          return;
        }

        if (res?.data) {
          toast.success("Login Successful! 🎉", {
            description: "Redirecting to dashboard...",
          });
          router.push("/workspaces");
          // Keep loading true while redirecting
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        });
        setIsLoading(false);
      }
    },
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-4">
          {/* E-MAIL FIELD */}
          <form.Field
            name="email"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    field.state.meta.errors.length > 0 &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {field.state.meta.errors ? (
                  <p className="text-xs text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          />

          {/* PASSWORD FIELD */}
          <form.Field
            name="password"
            children={(field) => (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    field.state.meta.errors.length > 0 &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {field.state.meta.errors ? (
                  <p className="text-xs text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Button disabled={isLoading} className="w-full mt-2">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </div>
      </form>

      {/* Social Login Section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        className="w-full gap-2"
      >
        <Github className="h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}
