import React, { useRef, useEffect, useState } from 'react';
import { Send, Mic, Eye, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onMicClick: () => void;
  onVisionClick: () => void;
  disabled: boolean;
  selectedImage: string | null;
  onImageSelect: (base64: string | null) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  onMicClick,
  onVisionClick,
  disabled,
  selectedImage,
  onImageSelect,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Envie uma tarefa para o AKI (status, código, erro)...",
    "Monitorando o barramento do banco SQLite...",
    "Compilando vetores de processamento locais...",
    "AKI está pronto para recalcular diretrizes..."
  ];

  // Rotate placeholders every 4.5 seconds for visual scanning aesthetic
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Auto-resize the height of textarea dynamically
  useEffect(() => {
    const area = textareaRef.current;
    if (area) {
      area.style.height = 'auto';
      area.style.height = `${Math.min(area.scrollHeight, 180)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && (value.trim() || selectedImage)) {
        onSubmit();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-transparent shrink-0 z-10 select-none">
      <div className="max-w-3xl mx-auto relative">
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Selected Image Thumbnail Preview */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-4 bottom-20 bg-neutral-950/90 border border-purple-500/30 p-2 rounded-xl flex items-center gap-2.5 shadow-2xl z-20 backdrop-blur-xl"
            >
              <img
                src={selectedImage}
                alt="preview"
                className="w-10 h-10 object-cover rounded-lg border border-white/10"
              />
              <div className="flex flex-col pr-1 select-none">
                <span className="text-[8px] font-bold text-gray-300 font-mono tracking-wider">MATRIZ_DE_IMAGEM</span>
                <span className="text-[7px] text-purple-400 font-mono tracking-widest uppercase">READY_FOR_SCAN</span>
              </div>
              <button
                onClick={() => {
                  onImageSelect(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="w-5 h-5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/35 transition-all cursor-pointer flex items-center justify-center text-xs font-bold font-mono active:scale-90"
                title="Remover imagem"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow backdrop ring */}
        <div className="absolute inset-0 bg-purple-500/5 blur-2xl rounded-3xl pointer-events-none transition-all" />

        {/* Shifting Gradient border wrapper */}
        <div className="relative group p-0.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 focus-within:from-purple-500/40 focus-within:via-indigo-500/40 focus-within:to-purple-500/40 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-all duration-500 shadow-2xl">
          
          {/* Input box wrap */}
          <div className="relative flex items-end gap-2 p-2 rounded-[14px] bg-neutral-950/70 backdrop-blur-xl">
            
            {/* Action buttons (Microphone, Vision, Paperclip) */}
            <div className="flex items-center gap-1 pl-1 select-none">
              <button
                onClick={onVisionClick}
                disabled={disabled}
                className="p-2 rounded-xl text-gray-500 hover:text-purple-400 hover:bg-purple-500/5 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
                title="Módulo de visão (Scan de monitor)"
              >
                <Eye size={17} />
              </button>
              <button
                onClick={onMicClick}
                disabled={disabled}
                className="p-2 rounded-xl text-gray-500 hover:text-purple-400 hover:bg-purple-500/5 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
                title="Controle de Voz (Aki Audio Capture)"
              >
                <Mic size={17} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="p-2 rounded-xl text-gray-500 hover:text-purple-400 hover:bg-purple-500/5 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
                title="Anexar imagem"
              >
                <Paperclip size={17} />
              </button>
            </div>

            {/* Text Area */}
            <div className="flex-1 relative flex items-center">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (items) {
                    for (let i = 0; i < items.length; i++) {
                      if (items[i].type.indexOf('image') !== -1) {
                        const file = items[i].getAsFile();
                        if (file) {
                          e.preventDefault();
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            onImageSelect(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }
                  }
                }}
                disabled={disabled}
                rows={1}
                className="w-full bg-transparent border-0 outline-none resize-none py-2 px-1 text-sm text-white placeholder-transparent max-h-[180px] scrollbar-thin select-text z-10"
              />
              
              {/* Dynamic Animated Placeholder Overlay */}
              {value === '' && (
                <div className="absolute left-1 pointer-events-none text-sm text-gray-500 font-mono tracking-wide flex items-center gap-1">
                  <span>{">"}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="inline-block"
                    >
                      {disabled ? "Aki está processando..." : placeholders[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-1 h-3.5 bg-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Send Action Trigger */}
            <button
              onClick={onSubmit}
              disabled={disabled || (!value.trim() && !selectedImage)}
              className={`p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                (value.trim() || selectedImage) && !disabled
                  ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md shadow-purple-600/20'
                  : 'bg-neutral-900 text-gray-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <Send size={15} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
