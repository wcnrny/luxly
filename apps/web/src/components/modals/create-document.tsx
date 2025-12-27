"use client";

import { useState, useRef } from "react";
import { useModal } from "@/utils/modal-store";
import { useCreateDocument } from "@/hooks/use-create-document";
import { Loader2, UploadCloud, FileText, CheckCircle2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/markdown",
  "text/csv",
];

export function CreateDocumentModal() {
  const { isOpen, type, data, onClose } = useModal();
  const open = type === "create-document" && isOpen;

  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadDocument, isPending } = useCreateDocument({
    onSuccess: () => {
      handleClose();
    },
  });

  const handleClose = () => {
    setSelectedFile(null);
    setTitle("");
    setTextContent("");
    setActiveTab("upload");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        alert("Invalid file type.");
        return;
      }
      setSelectedFile(file);
      setTitle(file.name.split(".").slice(0, -1).join("."));
    }
  };

  const onSubmit = () => {
    if (!data?.workspaceId) return;

    const formData = new FormData();
    formData.append("workspaceId", data?.workspaceId as string);
    formData.append("title", title);
    formData.append("access_token", data?.accessToken as string);

    if (activeTab === "upload") {
      if (!selectedFile) return;
      formData.append("file", selectedFile);
    } else {
      if (!textContent) return;
      const blob = new Blob([textContent], { type: "text/plain" });
      const file = new File([blob], `${title || "untitled"}.txt`, {
        type: "text/plain",
      });
      formData.append("file", file);
    }

    uploadDocument({ formData });
  };

  const isSubmitDisabled =
    isPending ||
    !title ||
    (activeTab === "upload" ? !selectedFile : !textContent);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background border shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Add New Document</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs
            defaultValue="upload"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-muted/60 rounded-xl mb-6">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 h-full rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                <UploadCloud className="w-4 h-4" /> Upload File
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 h-full rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                <FileText className="w-4 h-4" /> Write Text
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="upload"
              className="mt-0 focus-visible:outline-none"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">Upload Document</CardTitle>
                  <CardDescription>
                    Select a PDF, Word, or Text file from your computer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                      ${
                        selectedFile
                          ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
                          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept={ACCEPTED_MIME_TYPES.join(",")}
                      onChange={handleFileChange}
                    />

                    {selectedFile ? (
                      <>
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-in zoom-in-50 duration-300">
                          <CheckCircle2 className="h-7 w-7 text-primary" />
                        </div>
                        <p className="font-semibold text-foreground text-center text-lg">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          selected
                        </p>
                        <p className="text-xs text-primary mt-2 font-medium hover:underline">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                          <UploadCloud className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-foreground text-center">
                          Click to select or drag file here
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          PDF, DOCX, TXT, MD (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title-upload">Document Title</Label>
                    <Input
                      id="title-upload"
                      placeholder="e.g. Project Requirements"
                      value={title}
                      className="h-11"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="create"
              className="mt-0 focus-visible:outline-none"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">Write Content</CardTitle>
                  <CardDescription>
                    Create a simple text document directly here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title-create">Document Title</Label>
                    <Input
                      id="title-create"
                      placeholder="e.g. Meeting Notes"
                      value={title}
                      className="h-11"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Type your text here..."
                      className="min-h-[220px] resize-none p-4 leading-relaxed"
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3 border-t bg-muted/10 mt-2 py-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="h-11 px-8 primary-gradient text-white shadow-lg shadow-primary/20"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {activeTab === "upload" ? "Upload Document" : "Create Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
