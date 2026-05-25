import ReactMarkdown from "react-markdown";

interface MarkdownPageProps {
  content: string;
}

export function MarkdownPage({ content }: MarkdownPageProps) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
