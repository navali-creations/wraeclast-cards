import ReactMarkdown from "react-markdown";

interface MarkdownPageProps {
  content: string;
  className?: string;
}

export function MarkdownPage({ content, className }: MarkdownPageProps) {
  return (
    <div className={`prose${className ? ` ${className}` : ""}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
