// ─── DNA Triptych: main client component ─────────────────────────────────────
// Owns the canvas + overlay portal. Mounts inside ServicesSection.

'use client';

import { useRef, useCallback, useReducer, useEffect } from 'react';
import * as THREE from 'three';
import { useDNAScene } from './useDNAScene';
import { HoverOverlay } from './HoverOverlay';
import { hoverReducer, extractHitData, type HoverState } from './raycast';

const initialState: HoverState = {
  node: null,
  screenPos: null,
  variationId: null,
  hoverStartTime: 0,
  overlayVisible: false,
};

export default function DNATriptych() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverState, dispatch] = useReducer(hoverReducer, initialState);

  // Tick overlay visibility (debounce check)
  const tickInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTicking = useCallback(() => {
    if (tickInterval.current) return;
    tickInterval.current = setInterval(() => {
      dispatch({ type: 'TICK', now: Date.now() });
    }, 16); // ~60fps
  }, []);

  const stopTicking = useCallback(() => {
    if (tickInterval.current) {
      clearInterval(tickInterval.current);
      tickInterval.current = null;
    }
  }, []);

  const handleHoverNode = useCallback(
    (mesh: THREE.Mesh | null, screenPos: { x: number; y: number } | null) => {
      const hit = extractHitData(mesh, screenPos);
      if (hit) {
        dispatch({
          type: 'HOVER_START',
          node: hit.node,
          screenPos: hit.screenPos,
          variationId: hit.variationId,
        });
        startTicking();
      } else {
        dispatch({ type: 'HOVER_END' });
        stopTicking();
      }
    },
    [startTicking, stopTicking],
  );

  const { handlePointerMove, handlePointerLeave } = useDNAScene({
    canvasRef,
    onHoverNode: handleHoverNode,
  });

  // Inject keyframe animation once
  useEffect(() => {
    const id = 'dna-overlay-keyframes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes dna-overlay-in {
        from { opacity: 0; transform: translate(-50%, -100%) scale(0.9); }
        to   { opacity: 1; transform: translate(-50%, -110%) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className="relative w-full"
      style={{ minHeight: '80vh' }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'auto' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />

      <HoverOverlay
        node={hoverState.node}
        screenPos={hoverState.screenPos}
        visible={hoverState.overlayVisible}
      />
    </div>
  );
}
