import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-100 space-y-3">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt || "Imagem"}
                className="max-w-full max-h-[300px] rounded-xl border border-white/10 my-2.5 shadow-2xl object-contain bg-neutral-900/50 block"
              />
            );
          },
          // Handle code blocks (inline or custom boxed)
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="bg-black/40 text-[var(--color-primary)] font-mono text-xs px-1.5 py-0.5 rounded border border-white/5 font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const language = match[1] || 'text';
            const codeString = String(children).replace(/\n$/, '');

            return <CodeBlock code={codeString} language={language} />;
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-gray-200">{children}</li>;
          },
          strong({ children }) {
            return <strong className="text-white font-extrabold">{children}</strong>;
          },
          h1({ children }) {
            return <h1 className="text-lg font-extrabold text-white mt-4 mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-base font-bold text-white mt-3 mb-1">{children}</h2>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-white/5">
                <table className="min-w-full divide-y divide-white/10 bg-black/20 text-xs">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return <th className="px-4 py-2 bg-black/40 font-bold text-left text-gray-300">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2 border-t border-white/5 text-gray-200">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
