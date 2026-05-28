import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Cpu, Shield, ChevronRight, ChevronLeft, Zap, RefreshCw } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ping, setPing] = useState(14);
  const [cpu, setCpu] = useState(24);
  const [chartData, setChartData] = useState<number[]>([30, 45, 35, 55, 40, 60, 50]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [conversations, setConversations] = useState(1);
  const [messagesCount, setMessagesCount] = useState(5);

  const [isExecutingNexus, setIsExecutingNexus] = useState(false);
  const [nexusStatus, setNexusStatus] = useState('');

  const handleTriggerNexusAction = async (actionId: string, params?: Record<string, any>) => {
    setIsExecutingNexus(true);
    setNexusStatus(`NEXUS: Iniciando ${actionId}...`);
    try {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, params }),
      });
      const data = await res.json();
      if (data.ok) {
        setNexusStatus(`✓ ${data.message.split('!')[0]}`);
        const event = new CustomEvent('nexus-action-executed', { 
          detail: { actionId, message: data.message } 
        });
        window.dispatchEvent(event);
      } else {
        setNexusStatus(`❌ Falha: ${data.message}`);
      }
    } catch (err: any) {
      setNexusStatus(`⚠️ Erro: ${err.message}`);
    } finally {
      setTimeout(() => {
        setIsExecutingNexus(false);
        setNexusStatus('');
      }, 3500);
    }
  };

  // Real workstation system states
  const [cpuModel, setCpuModel] = useState<string>('Processador Neural');
  const [ramUsageGB, setRamUsageGB] = useState<string>('Calculando...');
  const [ramUsagePercent, setRamUsagePercent] = useState<number>(35);
  const [platform, setPlatform] = useState<string>('Estação');

  // Poll real-time system and SQLite database statistics from Prisma
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          setPing(data.dbLatency);
          setCpu(data.cpuUsage);
          setConversations(data.conversationCount);
          setMessagesCount(data.messageCount);
          setCpuModel(data.cpuModel);
          setRamUsageGB(data.ramUsageGB);
          setRamUsagePercent(data.ramUsagePercent);
          setPlatform(data.platform);
        }
      } catch (e) {
        // Fallback silently
      }
    };

    fetchTelemetry();
    const interval = setInterval(() => {
      fetchTelemetry();
      setChartData((prev) => {
        const nextVal = Math.floor(Math.random() * 40) + 30;
        return [...prev.slice(1), nextVal];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Map values to custom SVG path
  const svgPath = chartData
    .map((val, index) => `${(index * 25).toFixed(0)},${(100 - val).toFixed(0)}`)
    .join(' L ');

  return (
    <div className="absolute right-4 top-20 z-30 font-mono select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Minimized Capsule Button */
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-black/40 hover:bg-black/60 backdrop-blur-md text-cyan-400 hover:text-cyan-300 text-[10px] font-bold tracking-widest cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95 transition-all whitespace-nowrap"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            📡 TELEMETRIA ACTIVE
            <ChevronLeft size={10} />
          </motion.button>
        ) : (
          /* Expanded Premium Glass Dashboard */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 40 }}
            className="w-72 rounded-2xl border border-cyan-500/20 bg-black/55 backdrop-blur-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 text-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold tracking-widest">
                <Activity size={14} className="animate-pulse" />
                <span>MONITORAMENTO CORE</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer active:scale-90 transition-colors"
                title="Minimizar Painel"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              {/* Row 1: Freq & DB */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Estação Operador</span>
                <span className="text-cyan-400 font-bold text-xs flex items-center gap-1">
                  <Zap size={10} className="text-amber-500" /> {platform} OS
                </span>
                <span className="text-[9px] text-gray-400">Varredura contínua</span>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Banco SQLite</span>
                <span className="text-cyan-400 font-bold text-xs flex items-center gap-1">
                  <Database size={10} /> WAL ACTIVE
                </span>
                <span className="text-[9px] text-gray-400">Latência: {ping}ms</span>
              </div>

              {/* Row 2: Neural Net & Adaptation */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1 col-span-2">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Especificação do Processador</span>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-[10px] flex items-center gap-1 tracking-tight">
                    <Cpu size={10} className="shrink-0" /> {cpuModel}
                  </span>
                  <span className="text-[8px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    ONLINE
                  </span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1 col-span-2">
                <div className="flex justify-between items-center text-gray-500 font-bold uppercase tracking-wider">
                  <span>Memória Física (RAM)</span>
                  <span className="text-[9px] text-cyan-400">{ramUsagePercent}% USO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={10} className="text-cyan-400" />
                  <span className="text-[11px] font-bold text-cyan-400 tracking-wider font-mono">{ramUsageGB}</span>
                </div>
                <span className="text-[9px] text-gray-400">Monitoramento de integridade ativo</span>
              </div>
            </div>

            {/* SQLite Persistent Cognitive Memories Tree */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3 select-none">
              <div className="flex items-center justify-between text-[9px] text-gray-500">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Database size={10} className="text-cyan-400" />
                  MEMÓRIA COGNITIVA (SQLITE)
                </span>
                <button 
                  onClick={() => {
                    setIsIndexing(true);
                    setTimeout(() => setIsIndexing(false), 1200);
                  }}
                  className="text-[8px] font-extrabold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 hover:bg-cyan-500/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1 font-mono"
                >
                  <RefreshCw size={8} className={isIndexing ? "animate-spin" : ""} />
                  {isIndexing ? "INDEXANDO..." : "INDEXAR"}
                </button>
              </div>
              
              <div className="bg-black/35 rounded-xl border border-white/5 p-2 flex flex-col gap-1.5 font-mono text-[8px] text-gray-400">
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500">📁</span>
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-bold">mem_cognitiva.sqlite</span>
                    <div className="pl-3 border-l border-white/10 ml-1 mt-1 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400">├─ 🧠</span>
                        <span>conversations.sqlite <span className="text-[7px] text-cyan-500/80 font-bold">({conversations} registros)</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400">├─ ⚙️</span>
                        <span>messages.sqlite <span className="text-[7px] text-emerald-400/80 font-bold">({messagesCount} registros)</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400">├─ 🧬</span>
                        <span>neural_weights_wal.idx <span className="text-[7px] text-purple-400/60 font-semibold">(cached)</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400">└─ 💾</span>
                        <span>user_telemetry_history.db <span className="text-[7px] text-cyan-500/60 font-semibold">(sync)</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nexus Automation Quick Triggers */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap size={10} className="text-amber-500 animate-pulse" />
                CONTROLE DE AUTOMATIZAÇÃO (NEXUS)
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[9.5px] font-mono select-none">
                <button
                  onClick={() => handleTriggerNexusAction('system_diagnostics')}
                  disabled={isExecutingNexus}
                  className="p-2 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-cyan-500/20 text-gray-300 hover:text-cyan-400 font-bold tracking-wide active:scale-95 transition-all text-left flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Telemetria Real e logs de processos do Windows"
                >
                  <span>🖥️ Telemetria</span>
                </button>
                <button
                  onClick={() => handleTriggerNexusAction('open_app', { appName: 'calc' })}
                  disabled={isExecutingNexus}
                  className="p-2 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-amber-500/20 text-gray-300 hover:text-amber-400 font-bold tracking-wide active:scale-95 transition-all text-left flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Abrir Calculadora Nativa do Windows"
                >
                  <span>🧮 Calculadora</span>
                </button>
                <button
                  onClick={() => handleTriggerNexusAction('open_app', { appName: 'vscode' })}
                  disabled={isExecutingNexus}
                  className="p-2 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-purple-500/20 text-gray-300 hover:text-purple-400 font-bold tracking-wide active:scale-95 transition-all text-left flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Abrir VS Code no espaço de trabalho"
                >
                  <span>💻 VS Code</span>
                </button>
                <button
                  onClick={() => handleTriggerNexusAction('open_app', { appName: 'chrome' })}
                  disabled={isExecutingNexus}
                  className="p-2 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-emerald-500/20 text-gray-300 hover:text-emerald-400 font-bold tracking-wide active:scale-95 transition-all text-left flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Abrir Google Chrome"
                >
                  <span>🌐 Chrome</span>
                </button>
                <button
                  onClick={() => handleTriggerNexusAction('play_music', { musicName: 'lofi hip hop' })}
                  disabled={isExecutingNexus}
                  className="p-2 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-rose-500/20 text-gray-300 hover:text-rose-400 font-bold tracking-wide active:scale-95 transition-all text-left flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Tocar música ambiente no YouTube"
                >
                  <span>🎵 Tocar Lofi</span>
                </button>
                <button
                  onClick={() => handleTriggerNexusAction('purge_logs')}
                  disabled={isExecutingNexus}
                  className="p-2 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-purple-500/20 text-gray-300 hover:text-purple-400 font-bold tracking-wide active:scale-95 transition-all text-left flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Limpar logs desnecessários"
                >
                  <span>🧹 Purgar Logs</span>
                </button>
              </div>
              {nexusStatus && (
                <div className="text-[7.5px] font-extrabold text-cyan-400 font-mono tracking-wider bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/25 animate-pulse mt-0.5 select-text">
                  {nexusStatus}
                </div>
              )}
            </div>

            {/* Sparkline Graph */}
            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between text-[9px] text-gray-500">
                <span className="font-bold uppercase tracking-wider">Fluxo de Telemetria</span>
                <span className="text-cyan-400 font-bold">240Hz</span>
              </div>
              <div className="h-16 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden relative flex items-end">
                <svg className="w-full h-full p-1" viewBox="0 0 150 100" preserveAspectRatio="none">
                  <path
                    d={`M 0,100 L ${svgPath} L 150,100 Z`}
                    fill="url(#sparkline-gradient)"
                    opacity="0.15"
                  />
                  <path
                    d={`M 0,${(100 - chartData[0]).toFixed(0)} L ${svgPath}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
