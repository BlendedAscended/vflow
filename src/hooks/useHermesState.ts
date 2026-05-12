'use client';
import { useEffect, useState } from 'react';

export type AgentState = 'idle' | 'busy' | 'blocked' | 'away';

export interface ActivityEvent {
  ts: string;
  agent: string;
  message: string;
  level: 'info' | 'warn' | 'success';
}

export interface HermesState {
  agents: Record<string, AgentState>;
  events: ActivityEvent[];
}

export function useHermesState(): HermesState {
  const [state, setState] = useState<HermesState>({ agents: {}, events: [] });
  useEffect(() => {
    const es = new EventSource('/api/hermes/state');
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setState((prev) => ({
          agents: parsed.agents ?? prev.agents,
          events: parsed.events ?? prev.events,
        }));
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);
  return state;
}
