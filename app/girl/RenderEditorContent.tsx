import { cn } from "@/lib/utils";

interface Prop {
  html: string;
  className?: string;
}

const RenderEditorContent = ({ html, className }: Prop) => {
  return (
    <div
      className={cn("prose italic text-lg font-extralight", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RenderEditorContent;
