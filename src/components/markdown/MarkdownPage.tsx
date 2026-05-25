import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPageProps {
  content: string;
}

const components: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table>{children}</table>
    </div>
  ),
};

export function MarkdownPage({ content }: MarkdownPageProps) {
  return (
    <div className="prose mx-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
