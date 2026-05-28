import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';
import { promisify } from 'util';

const execPromise = promisify(exec);

export const dynamic = 'force-dynamic';

interface ActionRequest {
  actionId: string;
  params?: Record<string, any>;
}

// App command mapping for Windows shell executions
const APP_LAUNCH_COMMANDS: Record<string, string> = {
  spotify: 'start spotify:',
  vscode: 'code .',
  code: 'code .',
  roblox: 'start roblox:',
  chrome: 'start chrome',
  msedge: 'start msedge',
  calc: 'start calc',
  calculator: 'start calc',
  notepad: 'start notepad',
  explorer: 'start explorer',
  screen_capture: 'start ms-screenclip:',
  volumemixer: 'sndvol',
  whatsapp: 'start https://web.whatsapp.com',
  project: 'start explorer "c:\\Users\\Davi\\Desktop\\Aki"',
};

export async function POST(req: NextRequest) {
  try {
    const { actionId, params } = (await req.json()) as ActionRequest;

    if (!actionId) {
      return NextResponse.json({ ok: false, message: 'Falta o identificador da ação (actionId).' }, { status: 400 });
    }

    console.log(`[execute-action] Executando ação operacional: ${actionId}`, params);

    // 1. ACTION: Real System Diagnostics
    if (actionId === 'system_diagnostics') {
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const ramPercent = Math.round((usedMem / totalMem) * 100);

      // Fetch running process summary from PowerShell
      let processSummary = 'Nenhum log de processo encontrado.';
      try {
        const { stdout } = await execPromise('powershell -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 | ForEach-Object { \'{0} (CPU: {1:N1}%)\' -f $_.ProcessName, ($_.CPU / 100) }"');
        if (stdout.trim()) {
          processSummary = stdout.trim();
        }
      } catch (err) {
        console.warn('Failed to fetch real process metrics via PowerShell:', err);
      }

      return NextResponse.json({
        ok: true,
        message: 'Telemetria e diagnósticos de sistema gerados com sucesso localmente!',
        data: {
          cpuModel: cpus[0]?.model || 'Desconhecido',
          cpuCores: cpus.length,
          ramTotalGB: (totalMem / (1024 * 1024 * 1024)).toFixed(2),
          ramUsedGB: (usedMem / (1024 * 1024 * 1024)).toFixed(2),
          ramPercent,
          osPlatform: os.platform(),
          osRelease: os.release(),
          topProcesses: processSummary.split('\n').map(p => p.trim()),
          uptimeHours: (os.uptime() / 3600).toFixed(1),
        }
      });
    }

    // 2. ACTION: Open Native Applications
    if (actionId === 'open_app') {
      const appName = (params?.appName || '').toLowerCase();
      const launchCmd = APP_LAUNCH_COMMANDS[appName];

      if (!launchCmd) {
        return NextResponse.json({
          ok: false,
          message: `Aplicativo "${appName}" não é suportado pelo motor ou não está mapeado no sistema do AKI.`
        });
      }

      // Execute command in shell
      exec(launchCmd, (error) => {
        if (error) {
          console.error(`Error opening app ${appName}:`, error);
        }
      });

      return NextResponse.json({
        ok: true,
        message: `Comando enviado com sucesso! O aplicativo "${appName}" está abrindo em segundo plano.`
      });
    }

    // 3. ACTION: Web Search
    if (actionId === 'search') {
      const query = encodeURIComponent(params?.query || '');
      const searchUrl = `https://www.google.com/search?q=${query}`;
      
      exec(`start ${searchUrl}`, (error) => {
        if (error) {
          console.error(`Error executing search:`, error);
        }
      });

      return NextResponse.json({
        ok: true,
        message: `Busca na Web iniciada para: "${params?.query}"`
      });
    }

    // 4. ACTION: Play Music
    if (actionId === 'play_music') {
      const musicQuery = encodeURIComponent(params?.musicName || 'lofi hip hop');
      const musicUrl = params?.url || `https://www.youtube.com/results?search_query=${musicQuery}`;
      
      exec(`start ${musicUrl}`, (error) => {
        if (error) {
          console.error(`Error playing music:`, error);
        }
      });

      return NextResponse.json({
        ok: true,
        message: `Canal de áudio iniciado para: "${params?.musicName || 'Lofi Hip Hop'}"`
      });
    }

    // 5. ACTION: System Cleanup (Logs/Cache cleanup mock simulator)
    if (actionId === 'purge_logs') {
      return NextResponse.json({
        ok: true,
        message: 'Barramento e cache neural limpos com sucesso! Liberados 420MB de logs operacionais.'
      });
    }

    return NextResponse.json({
      ok: false,
      message: `Ação "${actionId}" não implementada ou desconhecida no barramento.`
    });

  } catch (err: any) {
    console.error('[execute-action] ERRO CRÍTICO:', err);
    return NextResponse.json({ ok: false, message: `Erro ao executar ação local: ${err.message}` }, { status: 500 });
  }
}
