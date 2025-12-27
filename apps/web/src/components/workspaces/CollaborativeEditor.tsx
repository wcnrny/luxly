"use client";

import { useEffect, useState, useMemo } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Document } from "@luxly/prisma";
import { Loader2 } from "lucide-react";
import * as Y from "yjs";
import { TiptapEditor } from "./tiptap-editor";
import { authClient } from "@/lib/auth-client";
import { stringToColor } from "@/utils/colors";

// FOR TESTING PURPOSES ONLY.
const WEBSOCKET_URL = "wss://collab.luxly.local";

export function CollaborativeEditor({
  doc: document,
  token,
}: {
  doc: Document;
  token: string;
}) {
  const documentId = document?.id;

  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const { data: session } = authClient.useSession();
  const userColor = stringToColor(session?.user.name ?? "anonymous");

  useEffect(() => {
    if (!documentId || !token) return;

    const newProvider = new HocuspocusProvider({
      url: WEBSOCKET_URL,
      name: documentId,
      document: ydoc,
      token: token,
      onConnect: () => console.log("Connected"),
      onClose: () => console.log("Disconnected"),
      onSynced: () => {
        newProvider.setAwarenessField("user", {
          name: session?.user.name,
          color: userColor,
        });
      },
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProvider(newProvider);

    return () => {
      newProvider.destroy();
    };
  }, [documentId, ydoc, token, session?.user.name, userColor]);

  if (!provider || !documentId) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TiptapEditor
      key={documentId}
      provider={provider}
      doc={ydoc}
      user={{ name: session?.user.name ?? "anonymous", color: userColor }}
    />
  );
}
