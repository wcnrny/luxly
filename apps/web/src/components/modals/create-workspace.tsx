/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useModal } from "@/utils/modal-store";
import { ImageUpload } from "@/components/image-upload"; // Yolunuza göre ayarlayın
import { cn } from "@/lib/utils";
import { fetchFromApi } from "@/utils/api";
import { PresignResponse } from "../../../types/api.type";

const stepOneSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters"),
  description: z.string().optional(),
  icon: z.instanceof(File).optional(),
});

const stepTwoSchema = z.object({
  emails: z.array(z.email("Invalid email address")),
});

export function CreateWorkspaceModal() {
  const { type, isOpen, onClose } = useModal();
  const open = type === "create-workspace" && isOpen;

  const [step, setStep] = React.useState<1 | 2>(1);
  const [createdWorkspaceId, setCreatedWorkspaceId] = React.useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      setCreatedWorkspaceId(null);
      form.reset();
    }
  }, [open]);
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      icon: undefined as File | undefined,
      emails: [] as string[],
      currentEmailInput: "",
    },
    onSubmit: async () => {},
  });

  const handleStepOneSubmit = async () => {
    setIsLoading(true);

    try {
      const values = form.state.values;
      const validation = stepOneSchema.safeParse({
        name: values.name,
        description: values.description,
        icon: values.icon,
      });

      if (!validation.success) {
        toast.error(validation.error.issues[0].message);
        setIsLoading(false);
        return;
      }

      let fileIconKey = "";
      if (values.icon) {
        const formData = new FormData();
        formData.append("file", values.icon);
        const params = new URLSearchParams({ contentType: values.icon.type });
        const presignRes = await fetchFromApi<PresignResponse>({
          path: `workspaces/upload/icon?contentType=${params.toString()}`,
          method: "GET",
        });

        const { uploadUrl, fileKey } = presignRes;

        await fetchFromApi({
          url: uploadUrl,
          method: "PUT",
          body: values.icon,
          headers: {
            "Content-Type": values.icon.type,
          },
        });

        fileIconKey = fileKey;
      }

      const res = await fetchFromApi<{ workspaceId: string }>({
        path: "workspaces",
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          iconURL: fileIconKey,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCreatedWorkspaceId(res.workspaceId);
      toast.success("Workspace created successfully!");

      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // ADIM 2: Davet Gönder
  const handleStepTwoSubmit = async () => {
    setIsLoading(true);
    try {
      const values = form.state.values;

      if (values.emails.length > 0) {
        // API İsteği: Davet gönder
        // await sendInvites({ workspaceId: createdWorkspaceId, emails: values.emails });

        await new Promise((r) => setTimeout(r, 1000));
        toast.success(`${values.emails.length} invitations sent!`);
      } else {
        toast.info("No invitations sent.");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send invites");
    } finally {
      setIsLoading(false);
    }
  };

  const addEmail = () => {
    const current = form.getFieldValue("currentEmailInput");
    const emailSchema = z.email();
    const result = emailSchema.safeParse(current);

    if (!result.success) {
      toast.error("Please enter a valid email");
      return;
    }

    if (form.state.values.emails.includes(current)) {
      toast.error("Email already added");
      return;
    }

    form.pushFieldValue("emails", current);
    form.setFieldValue("currentEmailInput", "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex items-center justify-center w-full mb-4">
          <div className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-300",
                step >= 1
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground"
              )}
            >
              1
            </div>

            <div
              className={cn(
                "w-16 h-[2px] mx-2 transition-colors duration-300",
                step >= 2 ? "bg-primary" : "bg-muted"
              )}
            />

            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-colors duration-300",
                step >= 2
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted text-muted-foreground"
              )}
            >
              2
            </div>
          </div>
        </div>

        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Create Your Workspace" : "Invite Team Members"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Give your workspace a name and an icon to get started."
              : "Invite your colleagues to collaborate immediately."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="grid gap-4 py-4"
        >
          {step === 1 && (
            <div className="grid gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <form.Field
                name="icon"
                children={(field) => (
                  <div className="grid gap-3">
                    <Label>Workspace Icon</Label>
                    <div className="flex items-center justify-center">
                      <ImageUpload
                        onChange={(file) =>
                          field.handleChange(file || undefined)
                        }
                      />
                    </div>
                  </div>
                )}
              />

              <form.Field
                name="name"
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Acme Corp."
                      disabled={isLoading}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          "border-red-500 ring-red-500"
                      )}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-xs text-red-500">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="description"
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Our team workspace..."
                      disabled={isLoading}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid gap-2">
                <Label>Email Addresses</Label>
                <div className="flex gap-2">
                  <form.Field
                    name="currentEmailInput"
                    children={(field) => (
                      <Input
                        placeholder="colleague@example.com"
                        value={field.state.value}
                        disabled={isLoading}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addEmail();
                          }
                        }}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    onClick={addEmail}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <form.Field
                name="emails"
                children={(field) => (
                  <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                    {field.state.value.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No emails added yet.
                      </p>
                    )}
                    {field.state.value.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newEmails = [...field.state.value];
                            newEmails.splice(index, 1);
                            field.handleChange(newEmails);
                          }}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          )}
        </form>

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button disabled={isLoading} variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} onClick={handleStepOneSubmit}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={isLoading}
                variant="ghost"
                onClick={() => onClose()}
              >
                Skip
              </Button>
              <Button disabled={isLoading} onClick={handleStepTwoSubmit}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invites & Finish
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
