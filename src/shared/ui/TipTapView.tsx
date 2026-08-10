"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import "@/src/shared/components/tiptap-node/blockquote-node/blockquote-node.scss";

interface RichTextProps {
  html: string;
}

export default function TipTapView({ html }: RichTextProps) {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Highlight.configure({ multicolor: true }), Image],
    content: html,
    immediatelyRender: false,
  });

  return (
    <EditorContent
      editor={editor}
      className="
        prose
        max-w-none

        [&_.ProseMirror]:outline-none

        [&_ul]:list-disc
        [&_ul]:ml-6

        [&_ol]:list-decimal
        [&_ol]:ml-6

        [&_img]:rounded-lg
        [&_img]:max-w-full
      "
    />
  );
}
