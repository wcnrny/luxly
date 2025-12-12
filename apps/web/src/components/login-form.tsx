/* eslint-disable react/no-children-prop */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.email().min(5),
  password: z.string().min(3),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await signIn("credentials", {
          ...value,
          redirect: false,
        }).then((res) => {
          if (res?.error) {
            toast.error("Wrong password or e-mail.", {
              description:
                "Check your credentials again... Maybe you missed an exclamation mark in your password?",
              action: <Button variant={"ghost"}>Okay...</Button>,
              actionButtonStyle: { alignSelf: "baseline" },
            });
            return;
          }
          if (res?.ok) {
            toast.success("🎉 Yippie!!", {
              description:
                "You are logged in! We will teleport you to dashboard in 3 seconds!",
              duration: 3000,
            });
            setTimeout(() => {
              router.push("/workspaces");
            }, 3000);
          }
        });
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occured!", {
          description:
            "Oh no! There is a problem while we were trying to log you in.",
          action: <Button variant={"ghost"}>Okay...</Button>,
        });
      }
    },
  });
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Log In</CardTitle>
        <CardDescription>Please log in to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>E-mail</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      aria-invalid={isInvalid}
                      placeholder="example@example.com"
                      autoComplete="on"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      aria-invalid={isInvalid}
                      placeholder="******"
                      autoComplete="on"
                      min={3}
                      type="password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="login-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
