'use client';

import { useEffect, useState } from 'react';

const AGENT_LABELS: Record<string, string> = {
  architect: 'Architect',
  designer: 'Designer',
  backend: 'Backend Engineer',
  validator: 'Validator',
  marketing: 'Marketing Strategist',
  booking: 'Booking Agent',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-[var(--muted-foreground)]',
  running: 'text-[var(--accent)]',
  succeeded: 'text-green-400',
  failed: 'text-red-400',
  skipped: 'text-[var(--muted-foreground)]/50',
};

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  running: '🔄',
  succeeded: '✓',
  failed: '✗',
  skipped: '—',
};

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PlanStatusClient({
  planId,
  initialData,
}: {
  planId: string;
  initialData: any;
}) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/plan/${planId}/status`);
      if (res.ok) setData(await res.json());
    }, 10000);
    return () => clearInterval(interval);
  }, [planId]);

  const runs = data?.agentRuns ?? [];

  return (
    <div>
      {/* Agent Runs */}
      {runs.length > 0 && (
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background)]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
            Agent Runs
          </h2>
          <div className="space-y-3">
            {runs.map((run: any) => (
              <div
                key={run.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]/50"
              >
                <span className="text-lg">{STATUS_ICONS[run.status] ?? '?'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)] text-sm">
                      {AGENT_LABELS[run.agent] ?? run.agent}
                    </span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded ${STATUS_COLORS[run.status]} bg-[var(--border)]/20`}
                    >
                      {run.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="font-mono">{run.model}</span>
                    {run.startedAt && <span>Started {formatTime(run.startedAt)}</span>}
                    {run.finishedAt && <span>• Finished {formatTime(run.finishedAt)}</span>}
                    {run.inputTokens != null && (
                      <span>• {run.inputTokens.toLocaleString()} in / {run.outputTokens?.toLocaleString() ?? 0} out</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wireframe preview CTA when URL appears via polling */}
      {data?.wireframeUrl && (
        <div className="mt-6 p-4 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/5 text-center">
          <p className="text-[var(--text-primary)] font-semibold mb-2">
            Wireframe is ready for preview!
          </p>
          <a
            href={`/plan/${planId}/preview`}
            className="inline-block px-6 py-2 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity text-sm"
          >
            View Preview
          </a>
        </div>
      )}

      {/* Move Forward when paid via polling */}
      {data?.paidAt && (
        <div className="mt-6 p-4 rounded-lg border border-green-500/30 bg-green-500/5 text-center">
          <p className="text-[var(--text-primary)] font-semibold mb-2">
            Plan paid — you&apos;re all set!
          </p>
          <a
            href="https://calendly.com/verbaflow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity text-sm"
          >
            Move Forward — Book a Call
          </a>
        </div>
      )}
    </div>
  );
}
