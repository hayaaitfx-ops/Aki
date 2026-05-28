import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Activity, ArrowRight, ShieldCheck, ShieldAlert, Cpu, Volume2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface MessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: any;
  confirm?: {
    message: string;
    actionId: string;
    status: 'pending' | 'allowed' | 'denied';
    params?: any;
  } | null;
  widget?: {
    type: 'system' | 'custom';
    title: string;
    description: string;
    details: Array<{ label: string; value: string }>;
    actionLabel?: string;
  } | null;
  error?: {
    message: string;
    details: string;
  } | null;
}

interface ChatMessageProps {
  message: MessageProps;
  isTyping: boolean;
  onConfirm: (actionId: string, allowed: boolean) => void;
  onWidgetAction?: (messageId: string) => void;
  onSpeak?: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isTyping,
  onConfirm,
  onWidgetAction,
  onSpeak,
}) => {
  const isAI = message.role === 'assistant';
  const [expandError, setExpandError] = useState(false);

  // Extract base64 image from markdown if present to bypass react-markdown XSS sanitization
  const imageRegex = /!\[(?:Imagem Anexada|Imagem Anexada|Upload|Imagem)\]\((data:image\/[a-z]+;base64,[^)]+)\)/;
  const match = message.content.match(imageRegex);
  const attachedImage = match ? match[1] : null;

  // Extract <thought>...</thought> or <thinking>...</thinking> tags if present in the message content
  const thoughtRegex = /<(?:thought|thinking)>([\s\S]*?)<\/(?:thought|thinking)>/;
  const thoughtMatch = message.content.match(thoughtRegex);
  const thoughtContent = thoughtMatch ? thoughtMatch[1].trim() : null;

  // Clean the markdown output of image links and thoughts
  let cleanContent = attachedImage 
    ? message.content.replace(imageRegex, '').trim() 
    : message.content;
  cleanContent = cleanContent.replace(thoughtRegex, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="w-full py-3.5 px-4 md:px-6 select-text"
    >
      <div className={`max-w-3xl mx-auto w-full flex items-start gap-4 p-5 md:p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden ${
         isAI 
          ? 'bg-[var(--color-primary)]/[0.04] border-[var(--color-primary)]/15 shadow-[0_4px_30px_rgba(139,92,246,0.02)] hover:border-[var(--color-primary)]/25 hover:shadow-[0_4px_35px_rgba(139,92,246,0.04)]' 
          : 'bg-neutral-900/35 border-white/5 hover:border-white/10 shadow-lg'
      }`}>
        
        {/* Futuristic left-border indicator on AI messages */}
        {isAI && (
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent" />
        )}
        
        {/* Avatar */}
        <div className="shrink-0 select-none relative z-10">
          {isAI ? (
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center shadow-md">
              <Sparkles className="text-[var(--color-primary)] animate-pulse" size={15} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-white/5 flex items-center justify-center text-xs font-bold text-gray-300">
              U
            </div>
          )}
        </div>

        {/* Message Content Bubble */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 relative z-10">
          
          {/* Header Name Info */}
          <div className="flex items-center justify-between w-full select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {isAI ? 'AKI' : 'Você'}
              </span>
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">
                {isAI ? 'Adaptive Knowledge Intelligence' : 'Operador'}
              </span>
            </div>
            {isAI && onSpeak && (
              <button
                onClick={() => onSpeak(message.content)}
                className="p-1 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors cursor-pointer active:scale-90"
                title="Ouvir Resposta (Voz do AKI)"
              >
                <Volume2 size={13} />
              </button>
            )}
          </div>

          {/* Body Text */}
          <div className="text-sm leading-relaxed text-gray-100 break-words pr-2">
            {attachedImage && (
              <img
                src={attachedImage}
                alt="Imagem Anexada"
                className="max-w-full max-h-[320px] rounded-xl border border-white/10 mb-3.5 shadow-2xl object-contain bg-neutral-950/40 block"
              />
            )}

            {/* Retro-HUD subconsciente AI Thoughts box */}
            {thoughtContent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3.5 p-3 rounded-lg border border-[var(--color-primary)]/10 bg-[var(--color-primary)]/[0.03] text-[11px] font-mono text-gray-400 leading-relaxed shadow-sm relative overflow-hidden select-text"
              >
                <div className="absolute inset-0 bg-hud-grid opacity-10 pointer-events-none" />
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1.5 select-none">
                  <Activity size={10} className="animate-pulse" />
                  <span>[🧠 SUBOPERACIONAL NÚCLEO]</span>
                </div>
                <div className="italic font-light pl-2 border-l border-[var(--color-primary)]/20 whitespace-pre-line text-gray-300">
                  {thoughtContent}
                </div>
              </motion.div>
            )}

            <MarkdownRenderer content={cleanContent} />
            
            {/* Blinking futuristic neon text cursor if typing stream active */}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-1.5 h-3.5 ml-1 bg-[var(--color-primary)] align-middle shadow-[0_0_8px_var(--color-color-primary)]"
              />
            )}
          </div>

          {/* Interactive AI Widgets Block */}
          {isAI && (
            <div className="flex flex-col gap-3 mt-1.5 max-w-xl">
              
              {/* 1. Confirmation Buttons Widget */}
              {message.confirm && (
                <div className="p-4 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center gap-2 select-none">
                    <Terminal className="text-[var(--color-primary)]" size={14} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Aki Prompt Autopurge
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                    {message.confirm.message}
                  </p>
                  
                  {message.confirm.status === 'pending' ? (
                    <div className="flex items-center gap-2 select-none">
                      <button
                        onClick={() => onConfirm(message.confirm!.actionId, true)}
                        className="px-4 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-all hover:shadow-[0_0_10px_var(--color-primary)]/20 active:scale-95 cursor-pointer"
                      >
                        Permitir
                      </button>
                      <button
                        onClick={() => onConfirm(message.confirm!.actionId, false)}
                        className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        Negar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold select-none">
                      {message.confirm.status === 'allowed' ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <ShieldCheck size={14} />
                          <span>Comando Autorizado</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400">
                          <ShieldAlert size={14} />
                          <span>Ação Negada Pelo Usuário</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Interactive Telemetry System Cards */}
              {message.widget && (
                <div className="p-4 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md flex flex-col gap-4 shadow-inner">
                  <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-2">
                      <Activity className="text-[var(--color-primary)]" size={14} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {message.widget.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">Telemetry Mode</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    {message.widget.details.map((detail, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5 bg-neutral-900/50 p-2.5 rounded-lg border border-white/[0.02]">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider select-none">
                          {detail.label}
                        </span>
                        
                        {/* Progress Bar draw if it represents a percentage value */}
                        {detail.value.includes('%') ? (
                          <div className="flex flex-col gap-1 font-mono">
                            <span className="text-xs font-bold text-white">{detail.value}</span>
                            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden select-none">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: detail.value }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-500 rounded-full"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-white font-mono">{detail.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {message.widget.actionLabel && onWidgetAction && (
                    <button
                      onClick={() => onWidgetAction(message.id)}
                      className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-[10px] font-bold text-gray-300 hover:text-white rounded-lg flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer active:scale-98"
                    >
                      <span>{message.widget.actionLabel}</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              )}

              {/* 3. Error Diagnostic Cards */}
              {message.error && (
                <div className="p-4 rounded-xl border border-rose-500/15 bg-rose-950/10 backdrop-blur-md flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center gap-2 select-none">
                    <Cpu className="text-rose-400 animate-pulse" size={14} />
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                      Diagnóstico de Exceção Aki
                    </span>
                  </div>
                  <p className="text-xs text-rose-200 font-semibold font-mono leading-relaxed">
                    {message.error.message}
                  </p>
                  
                  <button
                    onClick={() => setExpandError(!expandError)}
                    className="text-[10px] font-bold text-rose-400 hover:underline text-left w-fit select-none cursor-pointer"
                  >
                    {expandError ? 'Ocultar Traceback' : 'Ver Detalhes do Traceback...'}
                  </button>

                  {expandError && (
                    <pre className="p-3 bg-black/60 rounded-lg text-[10px] font-mono text-gray-400 overflow-x-auto border border-white/5 leading-normal max-h-40 scrollbar-thin">
                      {message.error.details}
                    </pre>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
