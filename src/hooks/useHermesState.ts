'use client';
import { useEffect, useState } from 'react';

export type AgentState = 'idle' | 'busy' | 'blocked' | 'away';

export function useHermesState(): Record<string, AgentState> {
  const [state, setState] = useState<Record<string, AgentState>>({});
  useEffect(() => {
    const es = new EventSource('/api/hermes/state');
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed?.agents) setState(parsed.agents);
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);
  return state;
}
