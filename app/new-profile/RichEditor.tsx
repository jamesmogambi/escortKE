// // // "use client";

// // // import { useEditor, EditorContent } from "@tiptap/react";
// // // import StarterKit from "@tiptap/starter-kit";

// // // export default function RichTextEditor({
// // //   value,
// // //   onChange,
// // // }: {
// // //   value: string;
// // //   onChange: (val: string) => void;
// // // }) {
// // //   const editor = useEditor({
// // //     extensions: [StarterKit],
// // //     content: value,
// // //     onUpdate: ({ editor }) => {
// // //       onChange(editor.getHTML());
// // //     },
// // //   });

// // //   return (
// // //     <EditorContent editor={editor} className="border p-4 rounded-md bg-white" />
// // //   );
// // // }

// // "use client";

// // import { useEditor, EditorContent } from "@tiptap/react";
// // import StarterKit from "@tiptap/starter-kit";
// // import { useEffect, useState } from "react";

// // export default function RichTextEditor({
// //   value,
// //   onChange,
// // }: {
// //   value: string;
// //   onChange: (val: string) => void;
// // }) {
// //   const [isClient, setIsClient] = useState(false);

// //   useEffect(() => {
// //     setIsClient(true);
// //   }, []);

// //   const editor = useEditor({
// //     extensions: [StarterKit],
// //     content: value,
// //     onUpdate: ({ editor }) => {
// //       onChange(editor.getHTML());
// //     },
// //     // 👇 Prevent SSR rendering
// //     editorProps: {
// //       attributes: {
// //         class: "prose prose-sm text-black p-4 border rounded-md bg-white",
// //       },
// //     },
// //     // 👇 This is the key fix
// //     immediatelyRender: false,
// //   });

// //   if (!isClient || !editor) return null;

// //   return <EditorContent editor={editor} />;
// // }

// "use client";

// import React, {
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css"; // Import Quill styles

// // Define the ref type for the RichTextEditor component
// export type RichTextEditorHandle = {
//   getContent: () => string;
// };

// const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const quillRef = useRef<Quill | null>(null);

//   useEffect(() => {
//     if (editorRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["clean"],
//           ],
//         },
//         placeholder: "Write something...",
//       });
//     }

//     return () => {
//       quillRef.current = null; // Cleanup to avoid memory leaks
//     };
//   }, []);

//   // Expose the getContent function to the parent component
//   useImperativeHandle(ref, () => ({
//     getContent: () => {
//       if (quillRef.current) {
//         return quillRef.current.root.innerHTML; // Return the HTML content
//       }
//       return "";
//     },
//   }));

//   return (
//     <div ref={editorRef} className="bg-white" style={{ height: "200px" }} />
//   );
// });

// RichTextEditor.displayName = "RichTextEditor";
// export default RichTextEditor;

"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

type QuillEditorProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const html =
          editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });

      // Set initial content
      quillRef.current.root.innerHTML = value;
    }
  }, [mounted]);

  return (
    <div className="border-none  rounded-md overflow-hidden bg-white ">
      {/* <div ref={editorRef} className="h-full" /> */}

      {mounted && (
        <div
          ref={editorRef}
          style={{ minHeight: "200px" }} // 👈 Ensure it's tall enough
          className="ql-container ql-snow"
        />
      )}
    </div>
  );
}
