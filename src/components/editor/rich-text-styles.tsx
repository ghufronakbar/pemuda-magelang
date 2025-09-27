import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";
import "@/components/tiptap-templates/simple/override.css";


import { cn } from "@/lib/utils";

function preserveEmptyParagraphs(html: string) {
  // Ubah <p></p>, <p><br></p>, atau variasinya menjadi p “kosong” yang punya isi &nbsp;
  return (
    html
      // <p>   </p> → <p data-empty="true">&nbsp;</p>
      .replace(/<p>(\s|&nbsp;)*<\/p>/gi, '<p data-empty="true">&nbsp;</p>')
      // <p><br ...></p> → <p data-empty="true">&nbsp;</p>
      .replace(/<p>\s*<br[^>]*>\s*<\/p>/gi, '<p data-empty="true">&nbsp;</p>')
  );
}

export default function RichTextStyles({
  content,
  className,
}: {
  content: string;
  className: string;
}) {
  const html = preserveEmptyParagraphs(content ?? "");

  return (
    <article
      className={cn("simple-editor-content max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
