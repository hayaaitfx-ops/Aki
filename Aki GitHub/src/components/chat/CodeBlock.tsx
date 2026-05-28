import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Clipboard, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-white/5 bg-neutral-950/80 shadow-lg text-xs font-mono max-w-full">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/5 select-none shrink-0">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copiado</span>
            </>
          ) : (
            <>
              <Clipboard size={12} />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Prism Syntax Highlight */}
      <div className="p-3 overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            background: 'transparent',
            padding: 0,
            margin: 0,
            fontSize: '11px',
            lineHeight: '1.6',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
