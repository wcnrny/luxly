"use client";

import { useMemo } from "react";
import { all, createLowlight } from "lowlight";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Doc } from "yjs";

const lowlight = createLowlight(all);

interface TiptapEditorProps {
  provider: HocuspocusProvider;
  user: {
    name: string;
    color: string;
  };
  doc: Doc;
}

export function TiptapEditor({ provider, user, doc }: TiptapEditorProps) {
  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        undoRedo: false,
        codeBlock: false,
      }),

      CodeBlockLowlight.configure({
        lowlight,
      }),

      Highlight,

      Collaboration.configure({
        document: doc,
      }),

      CollaborationCaret.configure({
        provider: provider,
        user: {
          name: user.name,
          color: user.color,
        },
      }),
    ];
  }, [doc, provider, user.name, user.color]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      extensions: extensions,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px]",
        },
      },
    },
    [doc, provider]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[500px] bg-background">
      <EditorContent editor={editor} />
    </div>
  );
}
