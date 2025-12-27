"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react"; // İkonlar
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File | string | null; // Seçilen dosya veya URL
  onChange: (file?: File) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  disabled,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
    disabled,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(undefined);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25 transition-all outline-none",
        isDragActive && "border-primary bg-primary/10",
        disabled && "opacity-50 cursor-not-allowed",
        preview && "border-none p-0 overflow-hidden"
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-full group">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
            <button
              onClick={removeImage}
              className="bg-red-500/80 hover:bg-red-500 p-2 rounded-full text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground/50" />
          <span className="text-center font-medium">Icon</span>
        </div>
      )}
    </div>
  );
};
