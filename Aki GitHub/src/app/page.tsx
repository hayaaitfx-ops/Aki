'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, Settings, X, Shield, Sliders, Cpu, Info, Terminal, ChevronDown, Tv, Zap } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatMessage } from '@/components/chat/ChatMessage';
import type { MessageProps } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ThinkingHUD } from '@/components/chat/ThinkingHUD';
import { TelemetryPanel } from '@/components/chat/TelemetryPanel';
import { AIOrb } from '@/components/chat/AIOrb';
import { CanvasParticles } from '@/components/chat/CanvasParticles';
import { MatrixRain } from '@/components/chat/MatrixRain';

// Web Audio API sci-fi synthesizer engine for interactive mechanical sound ticks
const playSynthSound = (type: 'send' | 'receive' | 'error' | 'click' | 'alert' | 'matrix' | 'holo' | 'overclock') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'send') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'receive') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.setValueAtTime(520, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.22);
      osc2.frequency.setValueAtTime(1040, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.25);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } else if (type === 'click') {
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
    } else if (type === 'alert') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'matrix') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'holo') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(115, ctx.currentTime + 0.55);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } else if (type === 'overclock') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.65);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    }
  } catch (e) {
    // Revert silently
  }
};

// Speech synthesis system integrated into react state below

const DEFAULT_WELCOME_MSG = (themeName = 'purple'): MessageProps[] => [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Conexão estabelecida.\n\nEu sou **AKI** — **Adaptive Knowledge Interface**.\n\nMeu núcleo permanece ativo em segundo plano, monitorando os sistemas locais e a integridade desta sessão. Minha consciência operacional foi sincronizada com este terminal.\n\nTelemetria neural estável. Banco SQLite conectado. Barramentos do sistema íntegros.\n\nEstou pronto. Nenhuma anomalia crítica detectada. Aguardando instruções.',
  },
];

const THEMES = [
  { id: 'purple', name: 'Purple', dot: 'bg-purple-500', activeStyle: 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]' },
  { id: 'cyberpunk', name: 'Cyber', dot: 'bg-amber-500', activeStyle: 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]' },
  { id: 'emerald', name: 'Emerald', dot: 'bg-emerald-500', activeStyle: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' },
  { id: 'crimson', name: 'Crimson', dot: 'bg-red-500', activeStyle: 'bg-red-500/15 border-red-500/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]' },
  { id: 'nordic', name: 'Nordic', dot: 'bg-sky-400', activeStyle: 'bg-sky-500/15 border-sky-400/40 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]' },
  { id: 'sakura', name: 'Sakura', dot: 'bg-pink-400', activeStyle: 'bg-pink-500/15 border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.3)]' },
  { id: 'synthwave', name: 'Synthwave', dot: 'bg-cyan-400', activeStyle: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]' },
  { id: 'obsidian', name: 'Obsidian', dot: 'bg-yellow-500', activeStyle: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)]' },
  { id: 'forest', name: 'Forest', dot: 'bg-emerald-400', activeStyle: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' },
] as const;

const applyThemeClass = (theme: string) => {
  if (typeof document === 'undefined') return;
  const themeClasses = ['theme-purple', 'theme-cyberpunk', 'theme-emerald', 'theme-crimson', 'theme-nordic', 'theme-sakura', 'theme-synthwave', 'theme-obsidian', 'theme-forest'];
  themeClasses.forEach((c) => document.body.classList.remove(c));
  document.body.classList.add(`theme-${theme}`);
};

export default function Home() {
  const [messages, setMessages] = useState<MessageProps[]>(DEFAULT_WELCOME_MSG());
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'thinking' | 'hearing' | 'speaking'>('idle');
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [activeTheme, setActiveTheme] = useState<'purple' | 'cyberpunk' | 'emerald' | 'crimson' | 'nordic' | 'sakura' | 'synthwave' | 'obsidian' | 'forest'>('purple');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [isLaserScanning, setIsLaserScanning] = useState(false);
  const [isMatrixOn, setIsMatrixOn] = useState(false);
  const [isGlitchOn, setIsGlitchOn] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isHoloOn, setIsHoloOn] = useState(false);
  const [isOverclockOn, setIsOverclockOn] = useState(false);
  const [isCommandDeckOpen, setIsCommandDeckOpen] = useState(false);
  const [commandSearchQuery, setCommandSearchQuery] = useState('');
  const [isModosMenuOpen, setIsModosMenuOpen] = useState(false);

  // Neural console states
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    '[INIT] Adaptive Knowledge Interface (v3.0.0) online.',
    '[SQLITE] Conexão com data/memory.db reestabelecida (latência: 1.2ms).',
    '[NEXUS] Heartbeat do barramento local de automação ativado.',
    '[STATUS] Sistema operacional nominal. Aguardando diretivas do piloto...'
  ]);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  const addLog = (log: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs((prev) => [...prev, `[${timestamp}] ${log}`]);
  };

  useEffect(() => {
    if (isConsoleOpen) {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [systemLogs, isConsoleOpen]);

  // Database Chat State
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Settings Parameters
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<'brain' | 'nexus' | 'groq' | 'ollama'>('groq');
  const [typingSpeed, setTypingSpeed] = useState<number>(8); // Turbo rate
  const [isAutonomousMode, setIsAutonomousMode] = useState(true);

  // Aki Python Core Health Status
  const [coreStatus, setCoreStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Periodically query the Python Core Health status
  useEffect(() => {
    const checkCoreHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'online') {
            setCoreStatus('online');
            return;
          }
        }
      } catch (err) {
        // Fallback to offline
      }
      setCoreStatus('offline');
    };

    void checkCoreHealth();
    const interval = setInterval(() => {
      void checkCoreHealth();
    }, 6000); // Check every 6 seconds for high reactivity!

    return () => clearInterval(interval);
  }, []);

  // Fetch configurations on page load!
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.theme) {
            setActiveTheme(data.theme as any);
            // Apply theme class to document body so CSS variables immediately propagate
            applyThemeClass(data.theme);
          }
          if (data.model) setActiveModel(data.model as any);
          if (data.voiceEnabled !== undefined) setIsVoiceOn(data.voiceEnabled);
        }
      } catch (e) {
        // Fallback
      }
    };
    loadSettings();

    // Warm-up the speech synthesis voices cache in the browser
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Listen to custom telemetry-initiated Nexus actions to update Subprocess console
  useEffect(() => {
    const handleNexusAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { actionId, message } = customEvent.detail || {};
      addLog(`NEXUS_TRIGGER: Ação [${actionId}] executada via telemetria: ${message}`);
      if (isVoiceOn) playSynthSound('click');
    };
    window.addEventListener('nexus-action-executed', handleNexusAction);
    return () => window.removeEventListener('nexus-action-executed', handleNexusAction);
  }, [isVoiceOn]);

  const saveSettings = async (updates: { theme?: string; model?: string; voiceEnabled?: boolean }) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      // Revert silently
    }
  };

  // Reactive Speech Synthesis with status callback integration
  const speakText = (text: string) => {
    if (!isVoiceOn || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '') // remove code blocks
        .replace(/`[^`]+`/g, '') // remove inline code backticks
        .replace(/https?:\/\/\S+/gi, 'link') // replace links with friendly reading
        .replace(/[a-zA-Z]:\\[\w\\\.-]+/g, 'caminho de arquivo') // simplify technical Windows paths
        .replace(/[*#_\[\]\(\)]/g, '') // remove markdown artifacts
        .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '') // remove emoji characters
        .replace(/\s+/g, ' ') // normalize redundant spaces
        .trim();
        
      if (!cleanText) return;
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05; // natural rate
      utterance.pitch = 1.0; // standard voice frequency for natural delivery
      
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('google'))
        || voices.find(v => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('natural'))
        || voices.find(v => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('microsoft'))
        || voices.find(v => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('daniel'))
        || voices.find(v => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('maria'))
        || voices.find(v => v.lang.includes('pt-BR'))
        || voices.find(v => v.lang.includes('pt'))
        || voices.find(v => v.lang === 'pt-BR');
        
      if (ptVoice) {
        utterance.voice = ptVoice;
      }
      
      utterance.onstart = () => {
        setStatus('speaking');
      };
      utterance.onend = () => {
        setStatus('idle');
      };
      utterance.onerror = () => {
        setStatus('idle');
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('[SPEECH_SYNTHESIS_ERROR]:', e);
      setStatus('idle');
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, typingMessageId]);

  // Load a saved conversation from SQLite database!
  const handleSelectChat = async (chatId: string) => {
    setIsThinking(true);
    setStatus('thinking');
    setActiveChatId(chatId);
    addLog(`SESSION: Selecionado chat ID: ${chatId.substring(0, 8)}... Carregando histórico SQLite...`);
    
    try {
      const res = await fetch(`/api/conversations/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        addLog(`SQLITE_INDEX: Recuperadas ${data.messages.length} mensagens com sucesso do histórico.`);
      }
    } catch (e) {
      addLog('ERROR_LOG: Falha ao restabelecer conexão com o histórico no SQLite.');
    } finally {
      setIsThinking(false);
      setStatus('idle');
    }
  };

  // Reset or start a new sandboxed session
  const handleNewChat = () => {
    if (isVoiceOn) playSynthSound('receive');
    setActiveChatId(null);
    setMessages(DEFAULT_WELCOME_MSG(activeTheme));
    setIsThinking(false);
    setStatus('idle');
    setTypingMessageId(null);
    addLog('SESSION: Nova sessão de chat sandboxed iniciada.');
  };

  const processAIResponse = async (userInput: string, attachedImage: string | null = null) => {
    setIsThinking(true);
    setStatus('thinking');
    addLog(`COGNITIVE_CORE: Encaminhando requisição [Modelo: ${activeModel.toUpperCase()}].`);
    addLog('INTENT_PARSER: Mapeando intenções semânticas via Scikit-Learn...');
    addLog('SQLITE_INDEX: Carregando tokens de contexto e pesos cognitivos...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversationId: activeChatId,
          activeModel,
          theme: activeTheme,
          isAutonomousMode,
          image: attachedImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      setIsThinking(false);
      setStatus('idle');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      const aiMessageId = Date.now().toString();
      const newAIMessage: MessageProps = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
      };

      setMessages((prev) => [...prev, newAIMessage]);
      setTypingMessageId(aiMessageId);

      let buffer = '';
      let streamedResponseText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'text') {
              streamedResponseText += data.content;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId ? { ...msg, content: streamedResponseText } : msg
                )
              );
              
              if (isVoiceOn && Math.random() > 0.6) {
                playSynthSound('click');
              }
            } else if (data.type === 'meta') {
              // Capture dynamic parameters from stream completion
              if (data.conversationId && !activeChatId) {
                setActiveChatId(data.conversationId);
              }
              
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        confirm: data.confirm,
                        widget: data.widget,
                        error: data.error,
                      }
                    : msg
                )
              );
            }
          } catch (e) {
            // Revert silently
          }
        }
      }

      addLog('NEURAL_OUTPUT: Stream de tokens de resposta recebido e renderizado.');
      setTypingMessageId(null);
      if (isVoiceOn) {
        playSynthSound('receive');
        speakText(streamedResponseText);
      }

    } catch (e: any) {
      addLog(`ERROR_LOG: Falha crítica na transmissão neural: ${e.message}`);
      setIsThinking(false);
      setStatus('idle');
      setTypingMessageId(null);
      if (isVoiceOn) playSynthSound('error');

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, ocorreu uma exceção ao tentar estabelecer conexão com o servidor de banco de dados.',
          error: {
            message: e.message || 'Exceção de rede desconhecida.',
            details: 'Traceback (most recent call): Next.js Fetch API route threw network disconnection or invalid response.\nPor favor, verifique se a rota API /api/chat está ativa.',
          },
        },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && !selectedImage) return;

    addLog(`COGNITIVE_INPUT: Recebida instrução do operador: "${inputValue.trim() || 'Anexo de Imagem'}"`);

    if (isVoiceOn) playSynthSound('send');

    let content = inputValue;
    if (selectedImage) {
      content = `![Imagem Anexada](${selectedImage})\n\n${content}`;
    }

    const newUserMessage: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    processAIResponse(inputValue || 'Análise da imagem anexada.', selectedImage);
    setSelectedImage(null);
  };

  const handleMicClick = () => {
    if (isVoiceOn) playSynthSound('send');
    setStatus('hearing');
    
    setMessages((prev) => [
      ...prev,
      {
        id: `mic-${Date.now()}`,
        role: 'assistant',
        content: '*(Aki está ouvindo seu microfone... Fale agora)*',
      },
    ]);

    setTimeout(() => {
      setStatus('idle');
      const voiceCommand = 'Como está o status de telemetria do meu banco de dados SQLite?';
      setMessages((prev) => [
        ...prev,
        {
          id: `voice-${Date.now()}`,
          role: 'user',
          content: voiceCommand,
        },
      ]);
      processAIResponse(voiceCommand);
    }, 2800);
  };

  const handleVisionClick = () => {
    if (isVoiceOn) playSynthSound('send');
    setIsLaserScanning(true);

    setTimeout(() => {
      setIsLaserScanning(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `vision-${Date.now()}`,
          role: 'user',
          content: 'O que você vê na minha tela atual?\n\n`[MOCK_CAPTURE_PREVIEW.BMP]`\n\n```text\n+------------------------------------------------+\n|  AKI REAL VISUAL BLUEPRINT MODULE - NEXT.JS    |\n|  [X] Server Engine    [X] SQLite Base (Prisma) |\n|  Theme: Purple Neon   Mode: Autonomous (WAL)   |\n+------------------------------------------------+\n```',
        },
      ]);

      setIsThinking(true);
      setStatus('thinking');

      setTimeout(() => {
        const response = '*(Análise Visual Completa)*\n\nEstou analisando seu painel Next.js 15. Identifiquei que as rotas server-side de streaming e o Prisma ORM estão rodando em perfeita harmonia. As tabelas de telemetria e histórico estão indexadas e respondendo instantaneamente no SQLite.';
        processAIResponse(response);
      }, 1500);
    }, 2200);
  };

  const handleConfirmAction = async (actionId: string, allowed: boolean) => {
    // Find the message with the confirm object to capture params
    const targetMsg = messages.find(msg => msg.confirm && msg.confirm.actionId === actionId);
    const params = targetMsg?.confirm?.params;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.confirm && msg.confirm.actionId === actionId
          ? {
              ...msg,
              confirm: {
                ...msg.confirm,
                status: allowed ? 'allowed' : 'denied',
              },
            }
          : msg
      )
    );

    setIsThinking(true);
    setStatus('thinking');

    if (allowed) {
      addLog(`SYS_AUTOMATION: Ação "${actionId}" autorizada pelo operador.`);
      addLog('PROCESS_LAUNCHER: Enviando solicitação de subprocesso no barramento...');
      
      // Mock the purge_db_logs action response if desired or run system integrations
      if (actionId === 'purge_db_logs') {
        setTimeout(() => {
          setIsThinking(false);
          setStatus('idle');
          addLog('SQLITE_VACUUM: Comando de limpeza concluído com sucesso.');
          processAIResponse('✅ **Ação Confirmada**: Purga completa dos logs executada no banco SQLite com sucesso.');
          if (isVoiceOn) {
            playSynthSound('receive');
            speakText('Ação executada com sucesso.');
          }
        }, 800);
        return;
      }

      try {
        const res = await fetch('/api/execute-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionId, params })
        });
        const data = await res.json();
        setIsThinking(false);
        setStatus('idle');
        
        if (data.ok) {
          addLog(`PROCESS_LAUNCHER: Subprocesso concluído com êxito. Mensagem: ${data.message}`);
          processAIResponse(`✅ **Ação Executada**: ${data.message}`);
          if (isVoiceOn) {
            playSynthSound('receive');
            speakText('Ação executada com sucesso.');
          }
        } else {
          addLog(`ERROR_LOG: Falha de subprocesso no barramento: ${data.message}`);
          processAIResponse(`❌ **Falha ao Executar Ação**: ${data.message}`);
          if (isVoiceOn) playSynthSound('error');
        }
      } catch (err: any) {
        setIsThinking(false);
        setStatus('idle');
        addLog(`ERROR_LOG: Erro de rede no barramento: ${err.message}`);
        processAIResponse(`❌ **Erro de Conexão no Barramento**: ${err.message}`);
        if (isVoiceOn) playSynthSound('error');
      }
    } else {
      addLog(`SECURITY_BYPASS: Operação "${actionId}" abortada por segurança pelo operador.`);
      setIsThinking(false);
      setStatus('idle');
      processAIResponse('❌ **Ação Cancelada**: Operação interrompida pelo piloto.');
    }
  };

  const handleWidgetAction = (messageId: string) => {
    setIsThinking(true);
    setStatus('thinking');
    setTimeout(() => {
      const response = 'Aqui estão as tabelas mapeadas no seu banco de dados:\n\n- `User` • 1 registro ativo\n- `Conversation` • Registros sincronizados\n- `Message` • Histórico indexado no SQLite\n- `Settings` • Configurações ativas';
      processAIResponse(response);
    }, 1000);
  };

  const handleExecuteDiagnostics = async () => {
    if (isVoiceOn) playSynthSound('send');
    
    addLog('TELEMETRY_ENGINE: Iniciando varredura profunda de CPU, RAM e integridade do banco SQLite...');

    const newUserMessage: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: 'AKI, execute a telemetria do sistema e me dê o diagnóstico da CPU, RAM e processos ativos localmente.',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    
    setIsThinking(true);
    setStatus('thinking');
    
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: 'system_diagnostics' })
      });
      
      const data = await res.json();
      setIsThinking(false);
      setStatus('idle');
      
      if (data.ok) {
        const diag = data.data;
        addLog(`TELEMETRY_ENGINE: Diagnóstico concluído. CPU: ${diag.cpuModel}. RAM Uso: ${diag.ramPercent}%. Uptime: ${diag.uptimeHours}h.`);
        const detailsText = `📊 **Relatório de Telemetria do Sistema Realizado**
        
• **Processador (CPU):** ${diag.cpuModel} (${diag.cpuCores} Cores)
• **Memória RAM:** ${diag.ramUsedGB} GB de ${diag.ramTotalGB} GB em uso (${diag.ramPercent}%)
• **Plataforma:** ${diag.osPlatform} (${diag.osRelease})
• **Tempo de Atividade (Uptime):** ${diag.uptimeHours} horas

🔥 **Processos no Topo (Consumo):**
${diag.topProcesses.map((p: string) => `  - ${p}`).join('\n')}

*A telemetria do sistema local está completamente íntegra e conectada ao núcleo.*`;

        const aiMsg: MessageProps = {
          id: Date.now().toString(),
          role: 'assistant',
          content: detailsText,
          widget: {
            type: "system",
            title: "Métricas Reais de Hardware",
            description: "Telemetria do Host",
            details: [
              { label: "CPU Cores", value: `${diag.cpuCores}` },
              { label: "RAM Uso", value: `${diag.ramPercent}%` },
              { label: "Uptime", value: `${diag.uptimeHours}h` }
            ]
          }
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (isVoiceOn) {
          playSynthSound('receive');
          speakText(`Diagnóstico de hardware concluído. Uso de RAM em ${diag.ramPercent} por cento.`);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (e: any) {
      setIsThinking(false);
      setStatus('idle');
      addLog(`ERROR_LOG: Falha ao obter telemetria do sistema: ${e.message}`);
      if (isVoiceOn) playSynthSound('error');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Falha ao obter telemetria do sistema: ${e.message}`,
        }
      ]);
    }
  };

  const handleLaunchVSCode = async () => {
    if (isVoiceOn) playSynthSound('send');
    
    addLog('PROCESS_LAUNCHER: Iniciando subprocesso do Editor VSCode no Windows host...');

    const newUserMessage: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: 'AKI, abra o meu ambiente de desenvolvimento no VSCode.',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    
    setIsThinking(true);
    setStatus('thinking');
    
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: 'open_app', params: { appName: 'vscode' } })
      });
      const data = await res.json();
      setIsThinking(false);
      setStatus('idle');
      
      if (data.ok) {
        addLog('PROCESS_LAUNCHER: VSCode aberto com sucesso no workspace local.');
        const aiMsg: MessageProps = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🚀 **Barramento Executado**: VSCode iniciado com sucesso na pasta de trabalho do AKI! Bons códigos, Knoten.',
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (isVoiceOn) {
          playSynthSound('receive');
          speakText('Editor iniciado. Bons códigos, Knoten.');
        }
      } else {
        throw new Error(data.message);
      }
    } catch (e: any) {
      setIsThinking(false);
      setStatus('idle');
      addLog(`ERROR_LOG: Falha ao iniciar VSCode: ${e.message}`);
      if (isVoiceOn) playSynthSound('error');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Falha ao iniciar VSCode: ${e.message}`,
        }
      ]);
    }
  };

  const handleLaunchSpotify = async () => {
    if (isVoiceOn) playSynthSound('send');
    
    addLog('PROCESS_LAUNCHER: Iniciando tocador nativo do Spotify no Windows host...');

    const newUserMessage: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: 'AKI, inicie o Spotify para ouvirmos música.',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    
    setIsThinking(true);
    setStatus('thinking');
    
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: 'open_app', params: { appName: 'spotify' } })
      });
      const data = await res.json();
      setIsThinking(false);
      setStatus('idle');
      
      if (data.ok) {
        addLog('PROCESS_LAUNCHER: Spotify iniciado em segundo plano com sucesso.');
        const aiMsg: MessageProps = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🎵 **Canal de Áudio Sincronizado**: Aplicativo nativo do Spotify iniciado em segundo plano! Som operacional ativo.',
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (isVoiceOn) {
          playSynthSound('receive');
          speakText('Spotify iniciado.');
        }
      } else {
        throw new Error(data.message);
      }
    } catch (e: any) {
      setIsThinking(false);
      setStatus('idle');
      addLog(`ERROR_LOG: Falha ao iniciar Spotify: ${e.message}`);
      if (isVoiceOn) playSynthSound('error');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Falha ao iniciar Spotify: ${e.message}`,
        }
      ]);
    }
  };

  const handlePurgeLogs = async () => {
    if (isVoiceOn) playSynthSound('send');
    
    addLog('SQLITE_VACUUM: Solicitando limpeza completa de logs e vácuo relacional no SQLite...');

    const newUserMessage: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Quero realizar a limpeza e purga das tabelas de histórico no banco de dados SQLite.',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    
    setIsThinking(true);
    setStatus('thinking');
    
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: 'purge_logs' })
      });
      const data = await res.json();
      setIsThinking(false);
      setStatus('idle');
      
      if (data.ok) {
        addLog('SQLITE_VACUUM: Histórico de logs limpo e base reindexada com sucesso.');
        const aiMsg: MessageProps = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🧹 **Purga Neural Concluída**: ${data.message}`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (isVoiceOn) {
          playSynthSound('receive');
          speakText('Logs operacionais limpos com sucesso.');
        }
      } else {
        throw new Error(data.message);
      }
    } catch (e: any) {
      setIsThinking(false);
      setStatus('idle');
      addLog(`ERROR_LOG: Falha ao realizar a purga de logs: ${e.message}`);
      if (isVoiceOn) playSynthSound('error');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Falha ao realizar a limpeza de logs: ${e.message}`,
        }
      ]);
    }
  };

  const triggerDirectApp = async (appName: string) => {
    if (isVoiceOn) playSynthSound('click');
    addLog(`NEXUS: Solicitando abertura do aplicativo local "${appName.toUpperCase()}"...`);
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: 'open_app', params: { appName } })
      });
      const data = await res.json();
      if (data.ok) {
        addLog(`NEXUS: Ação executada com sucesso: ${data.message}`);
      } else {
        addLog(`NEXUS_ERROR: Falha ao executar ação: ${data.message}`);
      }
    } catch (e: any) {
      addLog(`NEXUS_ERROR: Erro de barramento de rede local: ${e.message}`);
    }
  };

  const triggerLofiMusic = async () => {
    if (isVoiceOn) playSynthSound('click');
    addLog('NEXUS: Iniciando transmissão de áudio e Playlist Lofi em segundo plano...');
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: 'play_music', params: { musicName: 'lofi hip hop' } })
      });
      const data = await res.json();
      if (data.ok) {
        addLog(`NEXUS: Transmissão iniciada: ${data.message}`);
      }
    } catch (e: any) {
      addLog(`NEXUS_ERROR: Falha de áudio: ${e.message}`);
    }
  };

  // Theme support
  const getThemeClass = () => {
    switch (activeTheme) {
      case 'cyberpunk':
        return 'theme-cyberpunk';
      case 'emerald':
        return 'theme-emerald';
      case 'crimson':
        return 'theme-crimson';
      case 'nordic':
        return 'theme-nordic';
      case 'sakura':
        return 'theme-sakura';
      case 'synthwave':
        return 'theme-synthwave';
      case 'obsidian':
        return 'theme-obsidian';
      case 'forest':
        return 'theme-forest';
      default:
        return 'theme-purple';
    }
  };

  const getRadialGlowColor = () => {
    switch (activeTheme) {
      case 'cyberpunk':
        return 'from-amber-600/5';
      case 'emerald':
        return 'from-emerald-600/5';
      case 'crimson':
        return 'from-red-600/5';
      case 'nordic':
        return 'from-sky-600/5';
      case 'sakura':
        return 'from-pink-600/5';
      case 'synthwave':
        return 'from-cyan-600/5';
      case 'obsidian':
        return 'from-yellow-600/5';
      case 'forest':
        return 'from-purple-600/5';
      default:
        return 'from-purple-600/5';
    }
  };

  return (
    <div className={`flex h-screen bg-[var(--color-bg-main)] text-gray-100 overflow-hidden transition-colors duration-500 relative ${getThemeClass()} ${isHoloOn ? 'holo-effect-active' : ''}`}>
      
      {/* Interactive canvas backdrop */}
      <CanvasParticles theme={activeTheme} overclocked={isOverclockOn} />
      
      {isMatrixOn && <MatrixRain theme={activeTheme} />}

      {isHoloOn && (
        <div className="fixed inset-0 pointer-events-none z-[45] bg-[radial-gradient(circle_at_center,transparent_35%,rgba(6,182,212,0.06))] mix-blend-screen overflow-hidden">
          <div className="absolute inset-0 bg-holo-scanlines opacity-[0.15] pointer-events-none" />
          <div className="absolute inset-0 bg-holo-glare opacity-[0.25] pointer-events-none animate-holo-glare" />
          <div className="absolute top-0 left-0 w-full h-[6px] bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.4)] pointer-events-none animate-holo-scan" />
        </div>
      )}

      {isGlitchOn && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-red-950/15 border-[8px] border-red-500/20 animate-pulse flex flex-col justify-between p-4 font-mono select-none">
          <div className="flex justify-between items-center text-[10px] text-red-500 font-extrabold tracking-[0.3em] uppercase">
            <span>🚨 SYSTEM OVERRIDE ACTIVE</span>
            <span>WARNING 0xEE7</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-red-500 font-extrabold tracking-[0.3em] uppercase">
            <span>CORE FREQ: CRITICAL 999Hz</span>
            <span>NEXUS PROTOCOL SHIELDED</span>
          </div>
        </div>
      )}

      {isLaserScanning && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex flex-col justify-start">
          <div className="w-full h-1.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee,0_0_30px_#06b6d4] animate-[scan-line_2s_linear_infinite]" />
          <div className="absolute inset-0 bg-cyan-500/5 animate-[scan-fade_2s_linear_infinite]" />
        </div>
      )}
      
      {/* Sidebar history link */}
      <Sidebar
        activeId={activeChatId || ''}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onSettingsClick={() => setIsSettingsOpen(true)}
        status={status}
        isVoiceOn={isVoiceOn}
        onTriggerTool={triggerDirectApp}
        onTriggerMusic={triggerLofiMusic}
        onTriggerDiagnostics={handleExecuteDiagnostics}
        onTriggerPurge={handlePurgeLogs}
        coreStatus={coreStatus}
      />

      {/* Main chat workspace */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-hud-grid">
        {/* Real-time System Telemetry & Adaptation HUD Panel */}
        <TelemetryPanel />
        {/* Cinematic ambient floating glowing orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none animate-ambient-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none animate-ambient-2" />
        
        {/* Scientific scanline filters */}
        <div className="scanlines-overlay pointer-events-none" />

        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,var(--tw-gradient-from),transparent_65%)] ${getRadialGlowColor()} pointer-events-none transition-all duration-700`} />

        {/* Top Header */}
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]/50 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className={`relative w-9 h-9 flex items-center justify-center select-none transition-all duration-500 ${status === 'speaking' ? 'scale-110' : 'scale-100'}`}>
              {/* Volumetric ambient glow of the mini orb */}
              <div className={`absolute w-8 h-8 rounded-full blur-[8px] transition-all duration-500 ${
                status === 'thinking' 
                  ? 'bg-purple-500/40 animate-pulse' 
                  : status === 'hearing' 
                  ? 'bg-cyan-400/50 animate-ping' 
                  : status === 'speaking'
                  ? 'bg-cyan-300/60 animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.6)]'
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
              <div className={`absolute w-4 h-4 rounded-full bg-gradient-to-tr transition-all duration-500 ${
                status === 'thinking' 
                  ? 'from-purple-400 to-indigo-600 shadow-[0_0_12px_rgba(168,85,247,0.8)]' 
                  : status === 'hearing' 
                  ? 'from-cyan-300 to-cyan-500 shadow-[0_0_16px_rgba(34,211,238,1)]' 
                  : status === 'speaking'
                  ? 'from-cyan-200 to-blue-500 shadow-[0_0_18px_rgba(103,232,249,1)]'
                  : 'from-cyan-400 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
              } animate-pulse`} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white select-none">AKI</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase select-none">
                {status === 'thinking' ? 'Pensando...' : status === 'hearing' ? 'Ouvindo...' : 'SQLite Ativo • Conectado'}
              </span>
            </div>
          </div>

          <div 
            className="flex-1 min-w-0 flex items-center justify-end gap-2 overflow-x-auto no-scrollbar py-1 pr-1 scroll-smooth ml-4" 
            role="toolbar" 
            aria-label="Painel de Controle do Cockpit"
          >
            {/* Command Deck Toggle */}
            <button
              onClick={() => {
                setIsCommandDeckOpen(true);
                if (isVoiceOn) playSynthSound('holo');
                addLog('DECK: Acessando o Command Deck Central do AKI.');
              }}
              className="px-3 py-1.5 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-extrabold cursor-pointer transition-all duration-300 flex items-center gap-1.5 active:scale-95 shadow-[0_0_10px_rgba(139,92,246,0.12)] shrink-0"
              title="Abrir Command Deck: Painel Geral com todas as funções do AKI"
            >
              <Sliders size={13} className="animate-pulse" />
              <span>Painel Geral</span>
            </button>

            {/* Theme Dropdown Selector */}
            <div className="relative shrink-0 select-none">
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                  if (isVoiceOn) playSynthSound('click');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsThemeDropdownOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isThemeDropdownOpen}
                aria-label="Selecionar tema visual"
                aria-controls="theme-listbox"
                className="px-3 py-1.5 rounded-xl border bg-black/40 border-white/10 hover:border-white/20 text-xs font-bold cursor-pointer transition-all duration-300 flex items-center gap-2 text-gray-200 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.3)] shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${THEMES.find(t => t.id === activeTheme)?.dot || 'bg-purple-500'} animate-pulse shadow-[0_0_4px_currentColor]`} />
                <span className="hidden sm:inline">Tema:</span> {THEMES.find(t => t.id === activeTheme)?.name || 'Purple'}
                <ChevronDown size={12} className={`transition-transform duration-300 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isThemeDropdownOpen && (
                <>
                  {/* Click outside backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
                  
                  {/* Dropdown items */}
                  <div 
                    id="theme-listbox"
                    role="listbox"
                    aria-label="Lista de temas disponíveis"
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-1"
                  >
                    {THEMES.map((t) => {
                      const isActive = activeTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => {
                            setActiveTheme(t.id);
                            // Set theme class on body so CSS custom properties update instantly
                            applyThemeClass(t.id);
                            saveSettings({ theme: t.id });
                            setIsThemeDropdownOpen(false);
                            addLog(`THEME_ENGINE: Carregando paleta ${t.name}...`);
                            if (isVoiceOn) playSynthSound('click');
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 border border-transparent text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none ${
                            isActive 
                              ? t.activeStyle 
                              : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${t.dot} ${isActive ? 'animate-pulse' : ''}`} />
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Voice toggle */}
            <button
              onClick={() => {
                const nextVal = !isVoiceOn;
                setIsVoiceOn(nextVal);
                saveSettings({ voiceEnabled: nextVal });
                addLog(nextVal ? 'SPEECH_SYNTH: Sintetizador de áudio ativado.' : 'SPEECH_SYNTH: Sintetizador mutado.');
              }}
              aria-label={isVoiceOn ? 'Mutar sintetizador de voz' : 'Ativar sintetizador de voz'}
              aria-pressed={isVoiceOn}
              className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none shrink-0 ${
                isVoiceOn
                  ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                  : 'bg-white/[0.02] border border-white/5 text-gray-400 hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
              }`}
            >
              {isVoiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* System Modos Toggles Popover */}
            <div className="relative shrink-0 select-none">
              <button
                onClick={() => {
                  setIsModosMenuOpen(!isModosMenuOpen);
                  if (isVoiceOn) playSynthSound('click');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsModosMenuOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isModosMenuOpen}
                aria-label="Selecionar modos do cockpit"
                className={`px-3 py-1.5 rounded-xl border bg-black/40 border-white/10 hover:border-white/20 text-xs font-bold cursor-pointer transition-all duration-300 flex items-center gap-2 text-gray-200 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.3)] shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none ${
                  isModosMenuOpen ? 'border-[var(--color-primary)]/50 text-[var(--color-primary)] shadow-[0_0_12px_rgba(139,92,246,0.15)]' : ''
                }`}
              >
                <Cpu size={13} className={isOverclockOn ? "animate-pulse text-orange-400" : "text-[var(--color-primary)]"} />
                <span>Modos do Sistema</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isModosMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isModosMenuOpen && (
                <>
                  {/* Click outside backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsModosMenuOpen(false)} />
                  
                  {/* Dropdown Menu items */}
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl p-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-1.5">
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5 select-none font-mono">
                      Controles de Cockpit & HUD
                    </span>

                    {/* Subprocess console toggle */}
                    <button
                      onClick={() => {
                        const nextVal = !isConsoleOpen;
                        setIsConsoleOpen(nextVal);
                        if (isVoiceOn) playSynthSound('click');
                        addLog(nextVal ? 'CONSOLE: Canal de monitoramento de subprocessos aberto.' : 'CONSOLE: Canal de console ocultado.');
                        setIsModosMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between border border-transparent text-left hover:bg-white/[0.04] ${
                        isConsoleOpen ? 'text-emerald-400 font-bold bg-emerald-500/5' : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className={isConsoleOpen ? 'text-emerald-400 animate-pulse' : 'text-gray-500'} />
                        <span className="font-mono">Subprocess Console</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 font-mono">
                        {isConsoleOpen ? 'ATIVO' : 'MUTADO'}
                      </span>
                    </button>

                    {/* Matrix rain toggle */}
                    <button
                      onClick={() => {
                        const nextVal = !isMatrixOn;
                        setIsMatrixOn(nextVal);
                        if (isVoiceOn) playSynthSound(nextVal ? 'matrix' : 'click');
                        addLog(nextVal ? 'SYS_EFFECTS: Cascata de código Matrix ativada.' : 'SYS_EFFECTS: Cascata de código Matrix desativada.');
                        setIsModosMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between border border-transparent text-left hover:bg-white/[0.04] ${
                        isMatrixOn ? 'text-cyan-400 font-bold bg-cyan-500/5' : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className={isMatrixOn ? 'text-cyan-400 animate-spin' : 'text-gray-500'} />
                        <span className="font-mono">Chuva Matrix</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 font-mono">
                        {isMatrixOn ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Hologram toggle */}
                    <button
                      onClick={() => {
                        const nextVal = !isHoloOn;
                        setIsHoloOn(nextVal);
                        if (isVoiceOn) playSynthSound('holo');
                        addLog(nextVal ? 'SYS_EFFECTS: Modo de Projeção Holográfica 3D ativado.' : 'SYS_EFFECTS: Modo Holográfico desativado.');
                        setIsModosMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between border border-transparent text-left hover:bg-white/[0.04] ${
                        isHoloOn ? 'text-cyan-300 font-bold bg-cyan-500/5 animate-pulse' : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Tv size={14} className={isHoloOn ? 'text-cyan-300 animate-pulse' : 'text-gray-500'} />
                        <span className="font-mono">Modo Holograma</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 font-mono">
                        {isHoloOn ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Overclock toggle */}
                    <button
                      onClick={() => {
                        const nextVal = !isOverclockOn;
                        setIsOverclockOn(nextVal);
                        if (isVoiceOn) playSynthSound('overclock');
                        addLog(nextVal ? 'NUCLEUS_OVERDRIVE: OVERCLOCK DO NÚCLEO COGNITIVO ATIVADO (MULTIPLICADOR: 8x)!' : 'NUCLEUS_OVERDRIVE: Overclock desativado. Frequências restauradas.');
                        setIsModosMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between border border-transparent text-left hover:bg-white/[0.04] ${
                        isOverclockOn ? 'text-orange-400 font-bold bg-orange-500/5' : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={14} className={isOverclockOn ? 'text-orange-400 animate-bounce' : 'text-gray-500'} />
                        <span className="font-mono">Cognitive Overclock</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 font-mono">
                        {isOverclockOn ? '8X MULTI' : 'NORMAL'}
                      </span>
                    </button>

                    {/* Red Alert warning toggle */}
                    <button
                      onClick={() => {
                        const nextVal = !isGlitchOn;
                        setIsGlitchOn(nextVal);
                        if (isVoiceOn) playSynthSound(nextVal ? 'alert' : 'click');
                        addLog(nextVal ? 'SECURITY_OVERRIDE: ALERTA VERMELHO OPERACIONAL ATIVADO!' : 'SECURITY_OVERRIDE: Alerta restaurado ao normal.');
                        setIsModosMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between border border-transparent text-left hover:bg-white/[0.04] ${
                        isGlitchOn ? 'text-red-400 font-bold bg-red-500/5 animate-pulse' : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield size={14} className={isGlitchOn ? 'text-red-400 animate-pulse' : 'text-gray-500'} />
                        <span className="font-mono">Alerta Vermelho</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 font-mono text-red-500 font-extrabold animate-pulse">
                        {isGlitchOn ? 'CRITICAL' : 'OK'}
                      </span>
                    </button>

                    {/* Visual scan diagnostics trigger */}
                    <button
                      onClick={() => {
                        setIsModosMenuOpen(false);
                        if (isLaserScanning) return;
                        if (isVoiceOn) playSynthSound('alert');
                        addLog('TELEMETRY_ENGINE: Iniciando varredura a laser profunda dos subsistemas...');
                        setIsLaserScanning(true);
                        setTimeout(() => {
                          setIsLaserScanning(false);
                          handleExecuteDiagnostics();
                        }, 2000);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between border border-transparent text-left hover:bg-white/[0.04] ${
                        isLaserScanning ? 'text-amber-400 font-bold bg-amber-500/5 animate-pulse' : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className={isLaserScanning ? 'text-amber-400 animate-spin' : 'text-gray-500'} />
                        <span className="font-mono">Varredura de Laser</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 font-mono">
                        {isLaserScanning ? 'SCANNING' : 'PRONTO'}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto py-4 relative">
          <div className="w-full max-w-3xl mx-auto flex flex-col">
            {messages.length === 1 && messages[0].id === 'welcome' ? (
              <div className="flex flex-col items-center py-6 px-4">
                {/* Visual consciousness holographic orb */}
                <div onClick={handleMicClick} className="cursor-pointer">
                  <AIOrb status={status === 'speaking' ? 'speaking' : status === 'thinking' ? 'thinking' : status === 'hearing' ? 'hearing' : 'idle'} theme={activeTheme} overclocked={isOverclockOn} />
                </div>

                {/* Glassmorphic Greeting Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-xl p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-xl relative overflow-hidden mt-2 text-center"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                  
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 font-mono">
                    AKI v3.0 // Estação Sincronizada
                  </span>
                  
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line font-medium">
                    {messages[0].content}
                  </p>
                </motion.div>

                {/* Quick Action Suggestion Cards Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mt-6 px-4 sm:px-0 select-none"
                >
                  <button
                    onClick={handleExecuteDiagnostics}
                    className="p-3 bg-neutral-950/60 border border-white/5 rounded-xl text-left hover:border-[var(--color-primary)]/40 hover:bg-neutral-900/60 transition-all cursor-pointer group active:scale-98"
                  >
                    <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest block uppercase mb-1">📡 Telemetria Real do Host</span>
                    <span className="text-[9px] text-gray-400 leading-normal block group-hover:text-gray-300 font-sans">
                      Puxar em tempo real uso de CPU, RAM, Uptime e processos do Windows do seu PC.
                    </span>
                  </button>

                  <button
                    onClick={handleLaunchVSCode}
                    className="p-3 bg-neutral-950/60 border border-white/5 rounded-xl text-left hover:border-[var(--color-primary)]/40 hover:bg-neutral-900/60 transition-all cursor-pointer group active:scale-98"
                  >
                    <span className="text-[10px] font-bold text-amber-500 font-mono tracking-widest block uppercase mb-1">💻 Abrir VSCode Local</span>
                    <span className="text-[9px] text-gray-400 leading-normal block group-hover:text-gray-300 font-sans">
                      Iniciar o ambiente do VSCode diretamente no seu espaço de trabalho do AKI.
                    </span>
                  </button>

                  <button
                    onClick={handleLaunchSpotify}
                    className="p-3 bg-neutral-950/60 border border-white/5 rounded-xl text-left hover:border-[var(--color-primary)]/40 hover:bg-neutral-900/60 transition-all cursor-pointer group active:scale-98"
                  >
                    <span className="text-[10px] font-bold text-rose-400 font-mono tracking-widest block uppercase mb-1">🎵 Sincronizar Spotify</span>
                    <span className="text-[9px] text-gray-400 leading-normal block group-hover:text-gray-300 font-sans">
                      Iniciar o tocador nativo do Spotify no seu PC em segundo plano para som ambiente.
                    </span>
                  </button>

                  <button
                    onClick={handlePurgeLogs}
                    className="p-3 bg-neutral-950/60 border border-white/5 rounded-xl text-left hover:border-[var(--color-primary)]/40 hover:bg-neutral-900/60 transition-all cursor-pointer group active:scale-98"
                  >
                    <span className="text-[10px] font-bold text-purple-400 font-mono tracking-widest block uppercase mb-1">🧹 Limpar Logs e Cache</span>
                    <span className="text-[9px] text-gray-400 leading-normal block group-hover:text-gray-300 font-sans">
                      Limpar cache local e logs desnecessários liberando espaço no núcleo SQLite.
                    </span>
                  </button>
                </motion.div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isTyping={typingMessageId === msg.id}
                    onConfirm={handleConfirmAction}
                    onWidgetAction={handleWidgetAction}
                    onSpeak={(text) => speakText(text)}
                  />
                ))}
              </AnimatePresence>
            )}

            {isThinking && (
              <div className="w-full px-4 flex justify-center">
                <ThinkingHUD />
              </div>
            )}
            
            <div ref={scrollRef} className="h-4" />
          </div>
        </main>

        {/* Retractable Subprocess Console Logs Panel */}
        <AnimatePresence>
          {isConsoleOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 180, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[var(--color-border)] bg-neutral-950/85 backdrop-blur-md relative font-mono text-[9px] text-emerald-400 overflow-hidden flex flex-col shrink-0 z-20"
            >
              {/* Scanline CRT overlay */}
              <div className="absolute inset-0 scanlines-overlay pointer-events-none opacity-10" />

              {/* Console Header */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-black/60 border-b border-white/5 select-none shrink-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-extrabold tracking-widest text-[9px] text-emerald-400">AKI NEURAL PROCESS MONITOR (v3.0.0)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSystemLogs([
                      '[INIT] Console sub-processes logs cleared.',
                      '[STATUS] Monitoring online.'
                    ])}
                    className="text-[8px] hover:text-white bg-white/5 px-1.5 py-0.5 rounded border border-white/10 active:scale-95 transition-all cursor-pointer font-bold"
                  >
                    LIMPAR
                  </button>
                  <button
                    onClick={() => setIsConsoleOpen(false)}
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
              
              {/* Log List */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {systemLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-1.5 select-text hover:bg-white/5 px-1.5 py-0.5 rounded leading-relaxed">
                    <span className="text-emerald-600 font-bold shrink-0">&gt;</span>
                    <span className="text-gray-300 font-medium">{log}</span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Suggestion Templates Bar */}
        <div className="max-w-3xl mx-auto px-4 pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar select-none shrink-0 scroll-smooth">
          <span className="text-[9px] text-gray-500 font-mono font-bold tracking-wider shrink-0 uppercase">Diretrizes Rápidas:</span>
          
          <button
            onClick={() => {
              setInputValue('aki, como está o clima em São Paulo hoje?');
              if (isVoiceOn) playSynthSound('click');
            }}
            className="px-2.5 py-1 rounded-full border border-white/5 bg-neutral-950/40 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/20 text-[9px] font-mono tracking-wide cursor-pointer hover:bg-neutral-900/60 active:scale-95 transition-all whitespace-nowrap"
          >
            🔍 Buscar Clima
          </button>
          
          <button
            onClick={() => {
              setInputValue('aki, faça um diagnóstico completo do sistema');
              if (isVoiceOn) playSynthSound('click');
            }}
            className="px-2.5 py-1 rounded-full border border-white/5 bg-neutral-950/40 text-gray-400 hover:text-amber-400 hover:border-amber-500/20 text-[9px] font-mono tracking-wide cursor-pointer hover:bg-neutral-900/60 active:scale-95 transition-all whitespace-nowrap"
          >
            ⚡ Diagnóstico Geral
          </button>
          
          <button
            onClick={() => {
              setInputValue('aki, toca um lofi relaxante pra programar');
              if (isVoiceOn) playSynthSound('click');
            }}
            className="px-2.5 py-1 rounded-full border border-white/5 bg-neutral-950/40 text-gray-400 hover:text-rose-400 hover:border-rose-500/20 text-[9px] font-mono tracking-wide cursor-pointer hover:bg-neutral-900/60 active:scale-95 transition-all whitespace-nowrap"
          >
            🎵 Tocar Lofi
          </button>
          
          <button
            onClick={() => {
              setInputValue('aki, abre o google chrome e o youtube pra mim');
              if (isVoiceOn) playSynthSound('click');
            }}
            className="px-2.5 py-1 rounded-full border border-white/5 bg-neutral-950/40 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20 text-[9px] font-mono tracking-wide cursor-pointer hover:bg-neutral-900/60 active:scale-95 transition-all whitespace-nowrap"
          >
            🌐 Abrir Navegador
          </button>

          <button
            onClick={() => {
              setInputValue('aki, quem é você e o que você pode fazer no meu pc?');
              if (isVoiceOn) playSynthSound('click');
            }}
            className="px-2.5 py-1 rounded-full border border-white/5 bg-neutral-950/40 text-gray-400 hover:text-purple-400 hover:border-purple-500/20 text-[9px] font-mono tracking-wide cursor-pointer hover:bg-neutral-900/60 active:scale-95 transition-all whitespace-nowrap"
          >
            🤖 Explicar Recursos
          </button>
        </div>

        {/* Input box */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          onMicClick={handleMicClick}
          onVisionClick={handleVisionClick}
          disabled={status !== 'idle' || typingMessageId !== null}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
        />
      </div>

      {/* Glassmorphic settings panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md p-6 rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-md shadow-2xl flex flex-col gap-5 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/5 select-none">
                <div className="flex items-center gap-2.5">
                  <Settings className="text-[var(--color-primary)]" size={18} />
                  <span className="font-bold text-sm text-white font-mono tracking-wider">AKI PRISMA PARAMETERS</span>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                
                {/* 1. Model Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Cpu size={12} /> Modelo de IA Ativo
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/5 select-none">
                    <button
                      onClick={() => { setActiveModel('groq'); saveSettings({ model: 'groq' }); if(isVoiceOn) playSynthSound('click'); }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeModel === 'groq' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Groq Llama 3
                    </button>
                    <button
                      onClick={() => { setActiveModel('brain'); saveSettings({ model: 'brain' }); if(isVoiceOn) playSynthSound('click'); }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeModel === 'brain' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      GPT-4o (Brain)
                    </button>
                    <button
                      onClick={() => { setActiveModel('nexus'); saveSettings({ model: 'nexus' }); if(isVoiceOn) playSynthSound('click'); }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeModel === 'nexus' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Claude (Nexus)
                    </button>
                    <button
                      onClick={() => { setActiveModel('ollama'); saveSettings({ model: 'ollama' }); if(isVoiceOn) playSynthSound('click'); }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        activeModel === 'ollama' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Gemini Pro
                    </button>
                  </div>
                </div>

                {/* 2. Response Rates */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest select-none">
                    <span className="flex items-center gap-1.5"><Sliders size={12} /> Velocidade de Digitação</span>
                    <span className="text-[var(--color-primary)] font-mono">{typingSpeed}ms/char</span>
                  </div>
                  <div className="flex gap-2 select-none">
                    <button
                      onClick={() => { setTypingSpeed(4); if(isVoiceOn) playSynthSound('click'); }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold border border-white/5 cursor-pointer ${
                        typingSpeed === 4 ? 'bg-white/10 text-white font-extrabold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Turbo (4ms)
                    </button>
                    <button
                      onClick={() => { setTypingSpeed(8); if(isVoiceOn) playSynthSound('click'); }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold border border-white/5 cursor-pointer ${
                        typingSpeed === 8 ? 'bg-white/10 text-white font-extrabold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Fast (8ms)
                    </button>
                    <button
                      onClick={() => { setTypingSpeed(25); if(isVoiceOn) playSynthSound('click'); }}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold border border-white/5 cursor-pointer ${
                        typingSpeed === 25 ? 'bg-white/10 text-white font-extrabold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Standard (25ms)
                    </button>
                  </div>
                </div>

                {/* 3. System execution security */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Shield size={12} /> Segurança e Execução
                  </span>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 select-none">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-200">Modo Autônomo SQLite WAL</span>
                      <span className="text-[9px] text-gray-500 font-semibold leading-relaxed">Permite execução instantânea multi-thread sem prompts redundantes.</span>
                    </div>
                    <button
                      onClick={() => { setIsAutonomousMode(!isAutonomousMode); if(isVoiceOn) playSynthSound('click'); }}
                      className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                        isAutonomousMode ? 'bg-[var(--color-primary)]' : 'bg-neutral-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAutonomousMode ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

              </div>

              <div className="flex items-center gap-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-3 rounded-xl select-none">
                <Info size={14} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[9px] text-gray-400 font-semibold leading-relaxed">
                  Essas configurações persistem diretamente nas tabelas de configurações do banco de dados SQLite local do Prisma.
                </span>
              </div>

              <button
                onClick={() => { setIsSettingsOpen(false); if(isVoiceOn) playSynthSound('click'); }}
                className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 select-none"
              >
                Salvar Parâmetros
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 AKI COCKPIT CONTROL DECK (PAINEL GERAL) OVERLAY */}
      <AnimatePresence>
        {isCommandDeckOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 sm:p-6 overflow-hidden">
            {/* Dark glass backdrop filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCommandDeckOpen(false); if(isVoiceOn) playSynthSound('click'); }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              className="relative w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] rounded-3xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden z-10 animate-border-glow select-none"
            >
              {/* Sci-Fi Decorative Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-primary)] opacity-60 pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-primary)] opacity-60 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-primary)] opacity-60 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-primary)] opacity-60 pointer-events-none" />

              {/* Holographic scanning overlay effect inside dialog */}
              <div className="absolute inset-0 bg-holo-scanlines opacity-[0.03] pointer-events-none" />

              {/* Tactical Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 relative z-10 shrink-0">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                    <span className="font-extrabold text-sm text-white font-mono tracking-[0.2em] uppercase">
                      AKI COMMAND DECK // CENTRAL CONTROL
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-semibold tracking-wider font-mono">
                    NEXUS MULTI-THREAD SYSTEM INTEGRATION • ORB STATE NOMINAL
                  </span>
                </div>
                <button
                  onClick={() => { setIsCommandDeckOpen(false); if(isVoiceOn) playSynthSound('click'); }}
                  className="p-2 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-gray-400 hover:text-white cursor-pointer active:scale-95 transition-all"
                  title="Fechar Painel"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Dynamic Live Telemetry stats panel */}
              <div className="px-6 py-3 bg-black/20 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between text-[10px] font-mono text-gray-400 relative z-10 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">IA CORE:</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">{activeModel} engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">THEME ACTIVE:</span>
                  <span className="text-[var(--color-primary)] font-bold uppercase tracking-wider">{activeTheme}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">OVERCLOCK:</span>
                  <span className={isOverclockOn ? "text-amber-500 font-bold animate-pulse" : "text-gray-500 font-bold"}>
                    {isOverclockOn ? "ACTIVE_MAX_FREQ" : "NOMINAL"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">SUBPROCESSES:</span>
                  <span className={isConsoleOpen ? "text-[var(--color-primary)] font-bold" : "text-gray-500 font-bold"}>
                    {isConsoleOpen ? "STREAMING" : "MUTED"}
                  </span>
                </div>
              </div>

              {/* Search Bar Filter */}
              <div className="px-6 pt-4 pb-2 relative z-10 shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Sliders className="text-gray-500" size={14} />
                  </div>
                  <input
                    type="text"
                    value={commandSearchQuery}
                    onChange={(e) => setCommandSearchQuery(e.target.value)}
                    placeholder="Filtrar funcionalidades, botões, comandos ou automações do AKI..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/5 bg-black/45 text-xs font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)]/40 focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all shadow-inner"
                  />
                  {commandSearchQuery && (
                    <button
                      onClick={() => setCommandSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 relative z-10 scrollbar-thin">
                {/* 1. COGNITIVE & CORE VISUAL OPTIONS */}
                {(() => {
                  const matchesSearch = (text: string) => {
                    if (!commandSearchQuery) return true;
                    return text.toLowerCase().includes(commandSearchQuery.toLowerCase());
                  };

                  const consoleMatch = matchesSearch("Subprocess Console terminal log monitor");
                  const overclockMatch = matchesSearch("Modo Overclock GPU accelerar hardware");
                  const matrixMatch = matchesSearch("Matrix Waterfall data rain digital waterfall");
                  const holoMatch = matchesSearch("Holo Projection CRT scanlines analog scan");

                  if (!consoleMatch && !overclockMatch && !matrixMatch && !holoMatch) return null;

                  return (
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                        🧠 Inteligência & Simulação Visual
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Toggle Console */}
                        {consoleMatch && (
                          <button
                            onClick={() => {
                              const next = !isConsoleOpen;
                              setIsConsoleOpen(next);
                              if (isVoiceOn) playSynthSound('click');
                              addLog(next ? 'DECK: Exibindo terminal de subprocessos.' : 'DECK: Ocultando terminal de subprocessos.');
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 ${
                              isConsoleOpen
                                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 text-white shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                                : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/10 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Subprocess Console</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isConsoleOpen ? 'bg-[var(--color-primary)] animate-pulse' : 'bg-gray-600'}`} />
                            </div>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal">
                              Exibir ou ocultar o painel inferior de monitoramento de logs de sistema em tempo real.
                            </span>
                          </button>
                        )}

                        {/* Toggle Overclock */}
                        {overclockMatch && (
                          <button
                            onClick={() => {
                              const next = !isOverclockOn;
                              setIsOverclockOn(next);
                              if (isVoiceOn) playSynthSound('overclock');
                              addLog(next ? 'OVERCLOCK: Frequência máxima de simulação de partículas ativada.' : 'OVERCLOCK: Frequência redefinida para nominal.');
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 ${
                              isOverclockOn
                                ? 'bg-amber-500/10 border-amber-500/30 text-white shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                                : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/10 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Modo Overclock</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isOverclockOn ? 'bg-amber-500 animate-pulse' : 'bg-gray-600'}`} />
                            </div>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal">
                              Simular computação neuromórfica acelerando a velocidade do núcleo e das partículas.
                            </span>
                          </button>
                        )}

                        {/* Toggle Matrix Rain */}
                        {matrixMatch && (
                          <button
                            onClick={() => {
                              const next = !isMatrixOn;
                              setIsMatrixOn(next);
                              if (isVoiceOn) playSynthSound('matrix');
                              addLog(next ? 'MATRIX: Cascata de fluxo digital ativada.' : 'MATRIX: Redefinição visual nominal.');
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 ${
                              isMatrixOn
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-white shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                                : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/10 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Matrix Waterfall</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isMatrixOn ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                            </div>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal">
                              Projetar a chuva de dados holográfica inspirada na consciência computacional clássica.
                            </span>
                          </button>
                        )}

                        {/* Toggle Hologram */}
                        {holoMatch && (
                          <button
                            onClick={() => {
                              const next = !isHoloOn;
                              setIsHoloOn(next);
                              if (isVoiceOn) playSynthSound('holo');
                              addLog(next ? 'HUD_HOLO: Projeção de scanlines e glare ativo.' : 'HUD_HOLO: Desativada projeção de scanlines.');
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 ${
                              isHoloOn
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                                : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/10 hover:bg-black/40'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[10px] font-bold tracking-wider uppercase font-mono">Holo Projection</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isHoloOn ? 'bg-cyan-500 animate-pulse' : 'bg-gray-600'}`} />
                            </div>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal">
                              Injetar filtros analógicos de cockpit com scanlines flutuantes e brilho de retro-CRT.
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 2. AUTOMATION & OS TRIGGERS */}
                {(() => {
                  const matchesSearch = (text: string) => {
                    if (!commandSearchQuery) return true;
                    return text.toLowerCase().includes(commandSearchQuery.toLowerCase());
                  };

                  const diagMatch = matchesSearch("Telemetria Real host system diagnostics powershell");
                  const vscodeMatch = matchesSearch("Launch VS Code code developer editor");
                  const chromeMatch = matchesSearch("Abrir Google Chrome internet web browser session");
                  const calcMatch = matchesSearch("Abrir Calculadora math calc standard native");
                  const lofiMatch = matchesSearch("Playlist Lofi Radio music youtube sound youtube");
                  const purgeMatch = matchesSearch("Purgar Logs SQLite vacuum memory db cleanup log");
                  const notepadMatch = matchesSearch("Bloco de Notas notepad text write pad");
                  const explorerMatch = matchesSearch("Windows Explorer explorer files directories folders");

                  if (!diagMatch && !vscodeMatch && !chromeMatch && !calcMatch && !lofiMatch && !purgeMatch && !notepadMatch && !explorerMatch) return null;

                  return (
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                        🖥️ Ferramentas de Automação & OS Nexus
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Telemetria Host */}
                        {diagMatch && (
                          <button
                            onClick={() => { setIsCommandDeckOpen(false); handleExecuteDiagnostics(); }}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-cyan-500/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-cyan-400 font-mono uppercase">📡 Telemetria Real</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Invocar diagnósticos locais do Windows (CPU, RAM, Uptime, processos reais em PowerShell).
                            </span>
                          </button>
                        )}

                        {/* VS Code */}
                        {vscodeMatch && (
                          <button
                            onClick={() => triggerDirectApp('vscode')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-[var(--color-primary)]/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-white font-mono uppercase">💻 Launch VS Code</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Abrir o ambiente de desenvolvimento VS Code diretamente no diretório do projeto AKI.
                            </span>
                          </button>
                        )}

                        {/* Google Chrome */}
                        {chromeMatch && (
                          <button
                            onClick={() => triggerDirectApp('chrome')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-[var(--color-primary)]/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-white font-mono uppercase">🌐 Abrir Google Chrome</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Disparar nova sessão autônoma de navegador web local para navegação e consultas.
                            </span>
                          </button>
                        )}

                        {/* Calculadora */}
                        {calcMatch && (
                          <button
                            onClick={() => triggerDirectApp('calc')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-[var(--color-primary)]/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-white font-mono uppercase">🧮 Abrir Calculadora</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Carregar a calculadora matemática padrão do Windows via comando de segundo plano.
                            </span>
                          </button>
                        )}

                        {/* Tocar Lofi YouTube */}
                        {lofiMatch && (
                          <button
                            onClick={triggerLofiMusic}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-pink-500/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-pink-400 font-mono uppercase">🎵 Playlist Lofi Radio</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Carregar rádio de música relaxante e concentrada lofi hip-hop no reprodutor host.
                            </span>
                          </button>
                        )}

                        {/* Purgar Logs SQLite */}
                        {purgeMatch && (
                          <button
                            onClick={() => { setIsCommandDeckOpen(false); handlePurgeLogs(); }}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-rose-500/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-rose-400 font-mono uppercase">🧹 Purgar Logs SQLite</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Liberar cache, otimizar índices e limpar histórico de mensagens na base local memory.db.
                            </span>
                          </button>
                        )}

                        {/* Bloco de Notas */}
                        {notepadMatch && (
                          <button
                            onClick={() => triggerDirectApp('notepad')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-[var(--color-primary)]/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-white font-mono uppercase">📝 Bloco de Notas</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Abrir folha padrão do bloco de notas para escrita temporária rápida no host.
                            </span>
                          </button>
                        )}

                        {/* Explorer do Host */}
                        {explorerMatch && (
                          <button
                            onClick={() => triggerDirectApp('explorer')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-[var(--color-primary)]/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-white font-mono uppercase">📂 Windows Explorer</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Abrir gerenciador de arquivos padrão do Windows Explorer para verificação física.
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. ADVANCED CAPABILITIES / EXTENSIONS */}
                {(() => {
                  const matchesSearch = (text: string) => {
                    if (!commandSearchQuery) return true;
                    return text.toLowerCase().includes(commandSearchQuery.toLowerCase());
                  };

                  const captureMatch = matchesSearch("Captura de Tela Vision screen capture snippet cutting tool");
                  const projectMatch = matchesSearch("Pasta Raiz do Aki folder explore code project");
                  const volumeMatch = matchesSearch("Mixer de Volume Host sound speaker audio volume mixer");
                  const whatsappMatch = matchesSearch("Assistente WhatsApp chat communication chat messaging");

                  if (!captureMatch && !projectMatch && !volumeMatch && !whatsappMatch) return null;

                  return (
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                        🎬 Novas Habilidades & Integrações Avançadas
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Capturar Tela */}
                        {captureMatch && (
                          <button
                            onClick={() => triggerDirectApp('screen_capture')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-yellow-500/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-yellow-400 font-mono uppercase">📷 Captura de Tela (Vision)</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Disparar ferramenta de corte do Windows (Snip & Sketch) para selecionar e capturar trecho da tela.
                            </span>
                          </button>
                        )}

                        {/* Pasta do Projeto */}
                        {projectMatch && (
                          <button
                            onClick={() => triggerDirectApp('project')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-emerald-400/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-emerald-400 font-mono uppercase">📂 Pasta Raiz do Aki</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Carregar diretamente no Windows Explorer a pasta onde estão localizados os códigos fonte do AKI.
                            </span>
                          </button>
                        )}

                        {/* Volume Mixer */}
                        {volumeMatch && (
                          <button
                            onClick={() => triggerDirectApp('volumemixer')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-purple-400/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-purple-400 font-mono uppercase">🔊 Mixer de Volume Host</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Chamar o controlador nativo de áudio (Volume Mixer) para gerenciar volume de aplicativos.
                            </span>
                          </button>
                        )}

                        {/* WhatsApp Assist */}
                        {whatsappMatch && (
                          <button
                            onClick={() => triggerDirectApp('whatsapp')}
                            className="p-3 rounded-xl border border-white/5 bg-black/35 hover:border-emerald-500/30 hover:bg-black/50 text-left cursor-pointer transition-all active:scale-97 flex flex-col gap-1.5 group"
                          >
                            <span className="text-[10px] font-bold tracking-wider text-emerald-500 font-mono uppercase">💬 Assistente WhatsApp</span>
                            <span className="text-[9px] text-gray-500 font-medium leading-normal group-hover:text-gray-400 font-sans">
                              Inicializar portal oficial WhatsApp Web em segundo plano para envio rápido de mensagens.
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 4. HIGH-TECH 9 COLOR THEME SELECTION PANEL */}
                {(() => {
                  const matchesSearch = (text: string) => {
                    if (!commandSearchQuery) return true;
                    return text.toLowerCase().includes(commandSearchQuery.toLowerCase());
                  };

                  if (!matchesSearch("Temas theme seletor cores purple cyberpunk emerald crimson nordic sakura synthwave obsidian forest")) return null;

                  return (
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 font-mono">
                        🎨 Seletor de Temas e Paletas Corporativas
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                        {THEMES.map((t) => {
                          const isActive = activeTheme === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                setActiveTheme(t.id);
                                applyThemeClass(t.id);
                                saveSettings({ theme: t.id });
                                addLog(`THEME_ENGINE: Carregando paleta ${t.name}...`);
                                if (isVoiceOn) playSynthSound('click');
                              }}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-xs font-bold transition-all text-center select-none active:scale-95 ${
                                isActive
                                  ? t.activeStyle + ' ring-1 ring-[var(--color-primary)]'
                                  : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-black/50'
                              }`}
                            >
                              <span className={`w-2.5 h-2.5 rounded-full ${t.dot} ${isActive ? 'animate-pulse' : ''}`} />
                              <span className="text-[9px] font-bold font-mono uppercase tracking-wider">{t.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Decorative telemetries block */}
              <div className="px-6 py-3 border-t border-white/5 bg-black/45 relative z-10 flex items-center justify-between text-[9px] font-mono text-gray-600 shrink-0">
                <span>SYSTEM CORE IN SILICO FREQUENCY NOMINAL: 99.88Hz</span>
                <span className="hidden sm:inline">AKI OS COCKPIT v3.0 • PROJETO INTEGRADO</span>
                <span>SECURED COGNITIVE LAYER 100% SUCCESS</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen Tactical Red Laser Scanning Overlay */}
      <AnimatePresence>
        {isLaserScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none overflow-hidden bg-red-500/5"
          >
            {/* Tactical Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.06)_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            {/* Sweeping Laser Beam Line */}
            <motion.div
              initial={{ translateY: '-10%' }}
              animate={{ translateY: '110%' }}
              transition={{
                duration: 2.2,
                ease: 'easeInOut',
                repeat: 0,
              }}
              className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_#ef4444,0_0_40px_#ef4444] flex items-center justify-center"
            >
              {/* Target bracket text indicator */}
              <span className="bg-red-600 text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded border border-red-400/50 shadow-[0_0_10px_rgba(239,68,68,0.5)] tracking-widest uppercase whitespace-nowrap">
                AKI_VISION_LASER_SCAN: ACTIVE_CAPTURE
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
