import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Trash2,
  Settings,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Cpu,
  Folder,
  Music,
  Globe,
  Camera,
  Volume2,
  MessageCircle,
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onSettingsClick: () => void;
  status?: 'idle' | 'thinking' | 'hearing' | 'speaking';
  isVoiceOn?: boolean;
  onTriggerTool?: (appName: string) => void;
  onTriggerMusic?: () => void;
  onTriggerDiagnostics?: () => void;
  onTriggerPurge?: () => void;
  coreStatus?: 'online' | 'offline' | 'checking';
}

const playClickSound = (isVoiceOn: boolean) => {
  if (!isVoiceOn) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    gain.gain.setValueAtTime(0.008, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelectChat,
  onNewChat,
  onSettingsClick,
  status = 'idle',
  isVoiceOn = true,
  onTriggerTool,
  onTriggerMusic,
  onTriggerDiagnostics,
  onTriggerPurge,
  coreStatus = 'checking',
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'tools'>('chats');

  // Fetch histories dynamically from our Node/NextJS database API!
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {
      // Revert silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const refresh = () => {
      void fetchConversations();
    };

    const firstFetch = window.setTimeout(refresh, 0);
    
    // Auto-refresh chat list every 8 seconds for real-time reactivity!
    const interval = window.setInterval(refresh, 8000);
    return () => {
      window.clearTimeout(firstFetch);
      window.clearInterval(interval);
    };
  }, []);

  const handleDeleteAll = async () => {
    if (!confirm('Deseja realmente apagar todo o histórico de conversas do banco SQLite?')) return;
    
    try {
      const res = await fetch('/api/conversations', { method: 'DELETE' });
      if (res.ok) {
        setConversations([]);
        onNewChat();
      }
    } catch {
      // Revert silently
    }
  };

  const tools = [
    { id: 'diagnostics', name: 'Telemetria Host', desc: 'Diagnósticos físicos (CPU, RAM, processos) via PowerShell.', icon: Activity, action: onTriggerDiagnostics },
    { id: 'vscode', name: 'Launch VS Code', desc: 'Abrir IDE no diretório raiz do projeto.', icon: Sliders, action: () => onTriggerTool?.('vscode') },
    { id: 'chrome', name: 'Navegador Chrome', desc: 'Disparar sessão autônoma do Google Chrome.', icon: Globe, action: () => onTriggerTool?.('chrome') },
    { id: 'calc', name: 'Calculadora', desc: 'Abrir calculadora matemática nativa.', icon: Cpu, action: () => onTriggerTool?.('calc') },
    { id: 'lofi', name: 'Playlist Lofi Radio', desc: 'Transmissão de áudio relaxante do YouTube.', icon: Music, action: onTriggerMusic },
    { id: 'purge', name: 'Purgar Logs SQLite', desc: 'Reindexar banco SQLite e limpar histórico.', icon: Trash2, action: onTriggerPurge },
    { id: 'screen_capture', name: 'Captura de Tela', desc: 'Abrir ferramenta de corte e anotação.', icon: Camera, action: () => onTriggerTool?.('screen_capture') },
    { id: 'project', name: 'Pasta do Aki', desc: 'Abrir diretório raiz no Windows Explorer.', icon: Folder, action: () => onTriggerTool?.('project') },
    { id: 'volumemixer', name: 'Mixer de Volume', desc: 'Chamar controlador de mixer de áudio.', icon: Volume2, action: () => onTriggerTool?.('volumemixer') },
    { id: 'whatsapp', name: 'Assistente WhatsApp', desc: 'Abrir portal do WhatsApp Web.', icon: MessageCircle, action: () => onTriggerTool?.('whatsapp') },
  ];

  return (
    <div
      className={`h-full border-r border-[var(--color-border)] bg-[var(--color-bg-panel)]/40 backdrop-blur-xl flex flex-col transition-all duration-300 relative select-none z-20 shrink-0 ${
        collapsed ? 'w-[70px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)] select-none shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className={`relative w-7 h-7 flex items-center justify-center select-none shrink-0 transition-all duration-500 ${status === 'speaking' ? 'scale-110' : 'scale-100'}`}>
                {/* Volumetric ambient glow of the mini orb */}
                <div className={`absolute w-6 h-6 rounded-full blur-[6px] transition-all duration-500 ${
                  status === 'thinking' 
                    ? 'bg-purple-500/40 animate-pulse' 
                    : status === 'hearing' 
                    ? 'bg-cyan-400/50 animate-ping' 
                    : status === 'speaking'
                    ? 'bg-cyan-300/60 animate-pulse shadow-[0_0_16px_rgba(34,211,238,0.6)]'
                    : 'bg-cyan-500/30 animate-pulse'
                }`} />
                {/* Outer tech rotating ring */}
                <div className={`absolute inset-0 rounded-full border border-dashed animate-slow-rotate transition-colors duration-500 ${
                  status === 'thinking' 
                    ? 'border-purple-500/40' 
                    : status === 'hearing' 
                    ? 'border-cyan-400/40' 
                    : status === 'speaking'
                    ? 'border-cyan-300/80 animate-spin'
                    : 'border-cyan-500/30'
                }`} />
                {/* Glowing Core Sphere */}
                <div className={`absolute w-3 h-3 rounded-full bg-gradient-to-tr transition-all duration-500 ${
                  status === 'thinking' 
                    ? 'from-purple-400 to-indigo-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]' 
                    : status === 'hearing' 
                    ? 'from-cyan-300 to-cyan-500 shadow-[0_0_14px_rgba(34,211,238,1)]' 
                    : status === 'speaking'
                    ? 'from-cyan-200 to-blue-500 shadow-[0_0_16px_rgba(103,232,249,1)]'
                    : 'from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                } animate-pulse`} />
              </div>
              <span className="font-extrabold text-sm tracking-widest text-white font-mono">AKI AI HUB</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className={`relative w-7 h-7 flex items-center justify-center select-none shrink-0 transition-all duration-500 ${status === 'speaking' ? 'scale-110' : 'scale-100'}`}>
                {/* Volumetric ambient glow of the mini orb */}
                <div className={`absolute w-6 h-6 rounded-full blur-[6px] transition-all duration-500 ${
                  status === 'thinking' 
                    ? 'bg-purple-500/40 animate-pulse' 
                    : status === 'hearing' 
                    ? 'bg-cyan-400/50 animate-ping' 
                    : status === 'speaking'
                    ? 'bg-cyan-300/60 animate-pulse shadow-[0_0_16px_rgba(34,211,238,0.6)]'
                    : 'bg-cyan-500/30 animate-pulse'
                }`} />
                {/* Outer tech rotating ring */}
                <div className={`absolute inset-0 rounded-full border border-dashed animate-slow-rotate transition-colors duration-500 ${
                  status === 'thinking' 
                    ? 'border-purple-500/40' 
                    : status === 'hearing' 
                    ? 'border-cyan-400/40' 
                    : status === 'speaking'
                    ? 'border-cyan-300/80 animate-spin'
                    : 'border-cyan-500/30'
                }`} />
                {/* Glowing Core Sphere */}
                <div className={`absolute w-3 h-3 rounded-full bg-gradient-to-tr transition-all duration-500 ${
                  status === 'thinking' 
                    ? 'from-purple-400 to-indigo-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]' 
                    : status === 'hearing' 
                    ? 'from-cyan-300 to-cyan-500 shadow-[0_0_14px_rgba(34,211,238,1)]' 
                    : status === 'speaking'
                    ? 'from-cyan-200 to-blue-500 shadow-[0_0_16px_rgba(103,232,249,1)]'
                    : 'from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                } animate-pulse`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer active:scale-95 transition-colors"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Action Button: Start New Session */}
      <div className="p-3 shrink-0 select-none">
        <button
          onClick={onNewChat}
          className={`w-full py-2.5 rounded-xl border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/15 text-[11px] font-extrabold text-white tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer hover:shadow-[0_0_15px_rgba(139,92,246,0.08)]`}
        >
          <Plus size={14} className="text-[var(--color-primary)]" />
          {!collapsed && <span>NOVA CONVERSA</span>}
        </button>
      </div>

      {/* Sidebar Tabs (Conversas / Funcionalidades) */}
      {!collapsed && (
        <div className="px-3 pb-2 flex gap-1 select-none shrink-0 border-b border-white/5">
          <button
            onClick={() => { setActiveTab('chats'); playClickSound(isVoiceOn); }}
            className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-white/10 text-white font-extrabold shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Conversas
          </button>
          <button
            onClick={() => { setActiveTab('tools'); playClickSound(isVoiceOn); }}
            className={`flex-1 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-white/10 text-white font-extrabold shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Funcionalidades
          </button>
        </div>
      )}

      {/* Main Tabbed List */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
        {collapsed ? (
          // Collapsed View: Show chat icons
          <div className="space-y-2 py-2 flex flex-col items-center">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  activeId === chat.id
                    ? 'bg-neutral-800 border-white/10 text-[var(--color-primary)]'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-neutral-900/50'
                }`}
                title={chat.title}
              >
                <MessageSquare size={14} />
              </button>
            ))}
          </div>
        ) : activeTab === 'chats' ? (
          // Expanded Chats Tab
          <>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2.5 block mt-2.5 mb-1.5 select-none font-mono">
              Histórico Recente
            </span>

            {loading ? (
              <div className="text-[10px] text-gray-500 px-3 select-none">Carregando SQLite...</div>
            ) : conversations.length === 0 ? (
              <div className="text-[10px] text-gray-500 px-3 leading-normal py-2 select-none">
                Nenhuma conversa salva na base local.
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeId === chat.id
                        ? 'bg-neutral-800 border border-white/5 text-white shadow-inner font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-900/50'
                    }`}
                  >
                    <MessageSquare size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate flex-1 font-mono tracking-wide">{chat.title}</span>
                  </button>
                ))}
              </div>
            )
          }
          </>
        ) : (
          // Expanded Functional Tools Tab
          <>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-2.5 block mt-2.5 mb-1.5 select-none font-mono">
              Painel de Automotores
            </span>

            <div className="space-y-1.5 pb-2">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      playClickSound(isVoiceOn);
                      t.action?.();
                    }}
                    className="w-full text-left p-2 rounded-xl bg-black/25 hover:bg-neutral-800/60 border border-white/[0.02] hover:border-[var(--color-primary)]/20 transition-all duration-300 flex items-start gap-2.5 group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="p-1.5 rounded-lg bg-neutral-950/40 border border-white/5 text-[var(--color-primary)] shrink-0 transition-transform group-hover:scale-105">
                      <Icon size={13} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-gray-200 group-hover:text-white transition-colors tracking-wide uppercase font-mono truncate">{t.name}</span>
                      <span className="text-[8.5px] text-gray-500 font-semibold leading-relaxed line-clamp-2">{t.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Glowing Online indicators */}
      <div className="p-3 border-t border-[var(--color-border)] select-none shrink-0 space-y-2">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5"
            >
              {/* SQLite WAL indicators */}
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-gray-500 flex items-center gap-1">
                  <Database size={10} /> SQLite WAL Base
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_#10b981]" />
                  ACTIVE
                </span>
              </div>

              {/* Next.js Node indicators */}
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-gray-500 flex items-center gap-1">
                  <Activity size={10} /> NextJS Engine
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_#10b981]" />
                  ONLINE
                </span>
              </div>

              {/* Aki Python Core indicators */}
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-gray-500 flex items-center gap-1">
                  <Cpu size={10} /> Aki Python Core
                </span>
                {coreStatus === 'online' ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_#10b981]" />
                    ONLINE
                  </span>
                ) : coreStatus === 'offline' ? (
                  <span className="text-red-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping shadow-[0_0_6px_#ef4444]" />
                    OFFLINE
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
                    CHECKING
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <span title="SQLite WAL: ACTIVE"><Database size={12} className="text-emerald-400 animate-pulse" /></span>
              <span title="NextJS Engine: ONLINE"><Activity size={12} className="text-emerald-400 animate-pulse" /></span>
              <span title={`Aki Python Core: ${coreStatus.toUpperCase()}`}>
                <Cpu 
                  size={12} 
                  className={
                    coreStatus === 'online' 
                      ? 'text-emerald-400 animate-pulse' 
                      : coreStatus === 'offline' 
                      ? 'text-red-400 animate-bounce' 
                      : 'text-amber-400 animate-spin'
                  } 
                />
              </span>
            </div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex flex-col gap-1 select-none">
          <button
            onClick={onSettingsClick}
            className={`w-full py-2 px-2.5 rounded-xl hover:bg-neutral-800 text-gray-400 hover:text-white text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Configurações Avançadas"
          >
            <Settings size={14} />
            {!collapsed && <span className="font-mono text-[10px] tracking-widest uppercase">Parâmetros</span>}
          </button>

          {!collapsed && conversations.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="w-full py-2 px-2.5 rounded-xl hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span className="font-mono text-[10px] tracking-widest uppercase">Purga Histórico</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
