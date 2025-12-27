/* eslint-disable react/no-children-prop */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Github, CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBaseUrl } from "@/utils/api";
import { useDebounce } from "@/hooks/use-debounce";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  firstName: z.string().min(2, "Min 2 chars").max(20, "Max 20 chars"),
  lastName: z.string().min(2, "Min 2 chars").max(15, "Max 15 chars"),
  username: z.string().min(4, "Min 4 chars").max(20, "Max 20 chars"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Min 8 chars").max(20, "Max 20 chars"),
});

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const [localUsername, setLocalUsername] = React.useState("");
  const [localEmail, setLocalEmail] = React.useState("");

  const debouncedUsername = useDebounce(localUsername, 500);
  const debouncedEmail = useDebounce(localEmail, 500);

  const [isCheckingUser, setIsCheckingUser] = React.useState(false);
  const [usernameAvailable, setUsernameAvailable] = React.useState<
    boolean | null
  >(null);

  const [isCheckingEmail, setIsCheckingEmail] = React.useState(false);
  const [emailAvailable, setEmailAvailable] = React.useState<boolean | null>(
    null
  );

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (usernameAvailable === false || emailAvailable === false) {
        toast.error("Please fix the errors in the form.");
        return;
      }

      setIsLoading(true);
      try {
        const res = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.firstName + " " + value.lastName,
          username: value.username,
        });

        if (res.error) throw new Error("Registration failed");

        toast.success("Account created! 🚀", {
          description: "Welcome aboard. Redirecting...",
        });

        setTimeout(() => router.push("/login"), 1000);
      } catch (error) {
        console.error(error);
        toast.error("Registration Failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  React.useEffect(() => {
    async function checkUsername() {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      setIsCheckingUser(true);
      try {
        const res = await fetch(
          `${getBaseUrl()}/users/check?username=${debouncedUsername}`
        );
        const data = await res.json();
        setUsernameAvailable(data.usernameAvailable);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUser(false);
      }
    }
    checkUsername();
  }, [debouncedUsername]);

  React.useEffect(() => {
    async function checkEmail() {
      if (!debouncedEmail || !debouncedEmail.includes("@")) {
        setEmailAvailable(null);
        return;
      }
      setIsCheckingEmail(true);
      try {
        const res = await fetch(
          `${getBaseUrl()}/users/check?email=${debouncedEmail}`
        );
        const data = await res.json();
        setEmailAvailable(data.emailAvailable);
      } catch {
        setEmailAvailable(null);
      } finally {
        setIsCheckingEmail(false);
      }
    }
    checkEmail();
  }, [debouncedEmail]);

  const renderStatusIcon = (
    isChecking: boolean,
    isAvailable: boolean | null
  ) => {
    if (isChecking)
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (isAvailable === true)
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (isAvailable === false)
      return <XCircle className="h-4 w-4 text-destructive" />;
    return null;
  };

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
          {/* AD SOYAD (YAN YANA) */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="firstName"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn(
                      field.state.meta.errors.length > 0 && "border-destructive"
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            />
            <form.Field
              name="lastName"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn(
                      field.state.meta.errors.length > 0 && "border-destructive"
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <form.Field
            name="username"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="johndoe"
                    autoCapitalize="none"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setLocalUsername(e.target.value);
                    }}
                    className={cn(
                      (field.state.meta.errors.length > 0 ||
                        usernameAvailable === false) &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {renderStatusIcon(isCheckingUser, usernameAvailable)}
                  </div>
                </div>
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                ) : usernameAvailable === false ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    Username is already taken.
                  </p>
                ) : null}
              </div>
            )}
          />

          <form.Field
            name="email"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setLocalEmail(e.target.value);
                    }}
                    className={cn(
                      (field.state.meta.errors.length > 0 ||
                        emailAvailable === false) &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {renderStatusIcon(isCheckingEmail, emailAvailable)}
                  </div>
                </div>
                {field.state.meta.errors.length > 0 ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                ) : emailAvailable === false ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    Email is already in use.
                  </p>
                ) : null}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={cn(
                    field.state.meta.errors.length > 0 && "border-destructive"
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button
            disabled={isLoading || isCheckingUser || isCheckingEmail}
            className="w-full mt-2"
          >
            {(isLoading || isCheckingUser || isCheckingEmail) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with
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
