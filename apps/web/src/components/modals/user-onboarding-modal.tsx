"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload"; // Senin bileşenin
import { fetchFromApi } from "@/utils/api";
import { PresignResponse } from "../../../types/api.type";

export function UserOnboardingModal() {
  const { data: session, refetch } = authClient.useSession(); // update: Session'ı yenilemek için
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (
      !localStorage.getItem("onboarding-skipped") &&
      session?.user &&
      !session.user.image
    ) {
      setIsOpen(true);
    }
  }, [session]);

  const onSkip = () => {
    setIsOpen(false);
    localStorage.setItem("onboarding-skipped", "true");
    toast.info("You can update your profile later in settings.");
  };

  const onSubmit = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({ contentType: file.type });
      const presignRes = await fetchFromApi<PresignResponse>({
        path: `users/me/avatar-url?${params.toString()}`,
        method: "GET",
      });
      const { uploadUrl, fileKey } = presignRes;

      await fetchFromApi({
        url: uploadUrl,
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      await fetchFromApi({
        path: "users/me/avatar",
        method: "PATCH",
        body: JSON.stringify({ avatarUrl: fileKey }),
        headers: { "Content-Type": "application/json" },
      });

      await authClient.updateUser({ image: fileKey });

      await refetch({
        query: {
          disableRefresh: true,
        },
      });

      toast.success("Profile photo updated!");
      localStorage.setItem("onboarding-skipped", "true");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onSkip()}>
      {/* onOpenChange ile dışarı tıklayınca kapanmasını yönetiyoruz */}
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl text-center">
            Welcome to Luxly!
          </DialogTitle>
          <DialogDescription className="text-center">
            Let&apos;s put a face to the name. Upload a profile photo to get
            started.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex justify-center">
          <ImageUpload
            onChange={(f) => setFile(f || null)}
            // value={file} // ImageUpload bileşenin destekliyorsa
          />
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={onSubmit}
            disabled={!file || isLoading}
            className="w-full primary-gradient font-bold"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Continue
          </Button>
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
            className="w-full"
          >
            Skip for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
