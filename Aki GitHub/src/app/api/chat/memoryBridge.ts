import { createClient } from '@libsql/client';
import path from 'path';

// Locate the local Python SQLite memory database file absolute path
const pythonDbPath = path.resolve('C:/Users/Davi/Desktop/Aki/data/memory.db');
const dbUrl = `file:${pythonDbPath}`;

const client = createClient({
  url: dbUrl,
});

export interface PythonUserProfile {
  operatorName: string;
  interactionCount: number;
  interests: string[];
  assistantProfile: string;
  intentCounts: Record<string, number>;
  suggestedAdaptations: string[];
}

/**
 * Safely fetches user profile statistics and learned preferences directly from the Python core SQLite db.
 */
export async function getPythonUserProfile(): Promise<PythonUserProfile | null> {
  try {
    // 1. Fetch interaction count from kv_store
    let interactionCount = 0;
    try {
      const res = await client.execute({
        sql: "SELECT value FROM kv_store WHERE table_name = 'profile' AND key = 'interaction_count' LIMIT 1",
        args: []
      });
      if (res.rows.length > 0 && res.rows[0].value) {
        interactionCount = JSON.parse(res.rows[0].value as string);
      }
    } catch (e) {
      console.warn('[memoryBridge] Failed to read interaction_count:', e);
    }

    // 2. Fetch interests from kv_store
    let interests: string[] = [];
    try {
      const res = await client.execute({
        sql: "SELECT value FROM kv_store WHERE table_name = 'preferences' AND key = 'interests' LIMIT 1",
        args: []
      });
      if (res.rows.length > 0 && res.rows[0].value) {
        interests = JSON.parse(res.rows[0].value as string);
      }
    } catch (e) {
      console.warn('[memoryBridge] Failed to read interests:', e);
    }

    // 3. Fetch assistant profile from kv_store
    let assistantProfile = 'private_os_assistant';
    try {
      const res = await client.execute({
        sql: "SELECT value FROM kv_store WHERE table_name = 'profile' AND key = 'assistant_profile' LIMIT 1",
        args: []
      });
      if (res.rows.length > 0 && res.rows[0].value) {
        assistantProfile = JSON.parse(res.rows[0].value as string);
      }
    } catch (e) {
      console.warn('[memoryBridge] Failed to read assistant_profile:', e);
    }

    // 4. Fetch intent counts from kv_store
    const intentCounts: Record<string, number> = {};
    try {
      const res = await client.execute({
        sql: "SELECT key, value FROM kv_store WHERE table_name = 'intent_counts'",
        args: []
      });
      for (const row of res.rows) {
        if (row.key && row.value) {
          intentCounts[row.key as string] = JSON.parse(row.value as string);
        }
      }
    } catch (e) {
      console.warn('[memoryBridge] Failed to read intent_counts:', e);
    }

    // 5. Generate suggested adaptations based on intent count
    const suggestedAdaptations: string[] = [];
    if ((intentCounts.code || 0) >= 3) {
      suggestedAdaptations.push("MODO CODER ATIVO: O operador solicita muito código. Priorize a entrega de códigos e scripts limpos, estruturados e com validações de testes.");
    }
    if ((intentCounts.create || 0) >= 3 || (intentCounts.project || 0) >= 3) {
      suggestedAdaptations.push("MODO ARQUITETO ATIVO: Foco em criação de novos projetos e estruturas de diretórios.");
    }
    if ((intentCounts.greeting || 0) >= 5) {
      suggestedAdaptations.push("MODO COMPATÍVEL ATIVO: O operador gosta de conversas casuais. Aumente o toque humano e o carisma sutil.");
    }

    return {
      operatorName: 'Knoten', // Default active operator name
      interactionCount,
      interests,
      assistantProfile,
      intentCounts,
      suggestedAdaptations,
    };
  } catch (err) {
    console.error('[memoryBridge ERROR]: Could not fetch profile from local python database:', err);
    return null;
  }
}
