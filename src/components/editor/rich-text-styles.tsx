import "@/components/tiptap-templates/simple/override.css";

import { cn } from "@/lib/utils";

export default function RichTextStyles({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <article
      className={cn("view-article max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
