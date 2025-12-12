"use client";

import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/utils/modal-store";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function CreateWorkspaceModal() {
  const { data: session } = useSession();
  const { type, isOpen, onClose } = useModal();
  const open = type === "create-workspace" && isOpen;
  return (
    <Dialog open={open}>
      <form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Workspace</DialogTitle>
            <DialogDescription>
              Create your own workspace, invite your team and design together.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                placeholder="My Awesome Workspace"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                placeholder="This is my awesome workspace."
                required={false}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="name"
                name="name"
                autoComplete="off"
                placeholder="This is my awesome workspace."
                required={false}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onClose()} variant={"ghost"}>
              Close
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
