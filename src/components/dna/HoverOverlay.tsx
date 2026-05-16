// ─── DNA Triptych: hover overlay renderers ───────────────────────────────────
// Three overlay types: MetricCard, ProjectCard, IframePreview.
// All rendered as HTML above the Three.js canvas.

'use client';

import { useState, useEffect, useRef } from 'react';
import type { HelixNode, MetricData, ProjectData, IframeData } from './variations';

interface HoverOverlayProps {
  node: HelixNode | null;
  screenPos: { x: number; y: number } | null;
  visible: boolean;
}

export function HoverOverlay({ node, screenPos, visible }: HoverOverlayProps) {
  if (!node || !screenPos || !visible) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    left: screenPos.x,
    top: screenPos.y,
    transform: 'translate(-50%, -110%)',
    zIndex: 50,
    pointerEvents: 'none',
    animation: 'dna-overlay-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  };

  return (
    <div style={style} className="dna-hover-overlay">
      {node.overlayType === 'metric' && <MetricCard data={node.data as MetricData} label={node.label} />}
      {node.overlayType === 'project' && <ProjectCard data={node.data as ProjectData} label={node.label} sub={node.sub} />}
      {node.overlayType === 'iframe' && <IframePreview data={node.data as IframeData} label={node.label} />}
    </div>
  );
}

// ─── Metric Card (V1: Biometric Ledger) ──────────────────────────────────────

function MetricCard({ data, label }: { data: MetricData; label: string }) {
  return (
    <div className="bg-[#1a1a2e]/95 backdrop-blur-md border border-[#A5D6A7]/30 rounded-xl px-4 py-3 min-w-[160px] shadow-lg shadow-[#A5D6A7]/10">
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#A5D6A7]/70 mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-[#A5D6A7] font-mono">
        {data.value}
      </div>
      <div className="text-xs text-white/60 mt-1">
        {data.change}
      </div>
    </div>
  );
}

// ─── Project Card (V2: Chronological Pipeline) ───────────────────────────────

function ProjectCard({
  data,
  label,
  sub,
}: {
  data: ProjectData;
  label: string;
  sub?: string;
}) {
  const statusColors = {
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    planned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="bg-[#1a1a2e]/95 backdrop-blur-md border border-[#A5D6A7]/30 rounded-xl px-4 py-3 min-w-[180px] shadow-lg shadow-[#A5D6A7]/10">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A5D6A7]/70">
          {label}
        </span>
        {sub && (
          <span className="text-[10px] text-white/40">
            {sub}
          </span>
        )}
      </div>
      <div className="text-sm font-semibold text-white/90 mb-1">
        {data.name}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">
          {data.period}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusColors[data.status]}`}>
          {data.status}
        </span>
      </div>
    </div>
  );
}

// ─── Iframe Preview (V3: Quantum Network) ────────────────────────────────────

function IframePreview({ data, label }: { data: IframeData; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Timeout fallback: if iframe doesn't load in 1.2s, show static image
    timeoutRef.current = setTimeout(() => {
      if (!loaded) {
        setFailed(true);
      }
    }, 1200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loaded]);

  return (
    <div className="bg-[#1a1a2e]/95 backdrop-blur-md border border-[#A5D6A7]/30 rounded-xl overflow-hidden shadow-lg shadow-[#A5D6A7]/10">
      <div className="px-3 py-1.5 border-b border-[#A5D6A7]/20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A5D6A7]/70">
          {label}
        </span>
      </div>
      <div className="relative w-[280px] h-[180px]">
        {!failed ? (
          <iframe
            src={data.url}
            className="w-full h-full border-0"
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin"
            title={label}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
            {data.fallbackImg ? (
              <img
                src={data.fallbackImg}
                alt={label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white/30 text-sm">
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
