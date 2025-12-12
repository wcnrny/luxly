"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import { useEffect, useMemo } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

// TODO: Update this to proper url and port.
const WEBSOCKET_URL = "ws://127.0.0.1:8081";

export function CollaborativeEditor({ documentId }: { documentId: string }) {
  const provider = useMemo(() => {
    const ydoc = new Y.Doc();
    return new HocuspocusProvider({
      url: WEBSOCKET_URL,
      name: documentId,
      document: ydoc,
    });
  }, [documentId]);

  useEffect(() => {
    return () => {
      provider.destroy();
    };
  }, [provider]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Collaboration.configure({ document: provider?.document }),
      ],
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        },
      },
    },
    [provider]
  );
  if (!editor) {
    return <p>Loading...</p>;
  }
  return (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[500px]">
      <div className="mb-4 border-b pb-2">Butonlar buraya...</div>

      <EditorContent editor={editor} className="" cellPadding={96} />
    </div>
  );
}
