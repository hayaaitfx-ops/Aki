"use client";

import { useRef, useEffect, useState, useCallback } from 'react';

type ChunkHandler = (chunk: string) => void;

export function useAkiWs(url = 'ws://localhost:8000/ws') {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    return ws;
  }, [url]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.close();
    };
  }, [connect]);

  const send = useCallback((message: string, onChunk?: ChunkHandler, onDone?: () => void) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return Promise.reject(new Error('WebSocket not connected'));

    return new Promise<void>((resolve, reject) => {
      const handleMessage = (ev: MessageEvent) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'chunk') {
            onChunk?.(data.text || '');
          } else if (data.type === 'action') {
            // could surface action metadata
          } else if (data.type === 'done') {
            ws.removeEventListener('message', handleMessage);
            onDone?.();
            resolve();
          }
        } catch (e) {
          // ignore
        }
      };

      ws.addEventListener('message', handleMessage);
      ws.send(JSON.stringify({ message }));
      // safety timeout
      setTimeout(() => {
        ws.removeEventListener('message', handleMessage);
        resolve();
      }, 120000);
    });
  }, []);

  return { connected, send, connect };
}
