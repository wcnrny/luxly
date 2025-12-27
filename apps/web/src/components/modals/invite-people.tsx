"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail } from "lucide-react";

import { useModal } from "@/utils/modal-store";
import { getBaseUrl } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function InvitePeopleModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { data: session } = authClient.useSession();

  const open = type === "invite-people" && isOpen;

  const { workspaceId } = data || {};

  const onSubmit = async () => {
    if (!email || !workspaceId) {
      toast.error("Missing information.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${getBaseUrl()}/workspaces/add/${workspaceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.session.token}`,
        },
        body: JSON.stringify({
          workspaceId,
          email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add member");
      }

      toast.success("Member added directly to workspace! 🚀");
      onClose();
      setEmail("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite People
          </DialogTitle>
          <DialogDescription>
            Add a new member to this workspace directly by their email address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-left">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder="colleague@example.com"
                className="pl-9"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmit();
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || !email}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Add Member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
