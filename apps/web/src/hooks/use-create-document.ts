// hooks/use-create-document.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchFromApi } from "@/utils/api";
import { Document } from "@/lib/prisma";

export function useCreateDocument({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const response = await fetchFromApi<Document[]>({
        path: `workspaces/${formData.get("workspaceId")}/documents/upload`,
        method: "POST",
        body: formData,
      });

      return response;
    },
    onSuccess: () => {
      toast.success("Document started processing!");
      queryClient.invalidateQueries({ queryKey: ["documents"] }); // Listeyi yenile
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
