// ─── DNA Triptych: raycaster + hover state machine ───────────────────────────
// Manages hover state transitions and debouncing for smooth overlay behavior.

import * as THREE from 'three';
import type { HelixNode } from './variations';

export interface HoverState {
  /** Currently hovered node, null if none */
  node: HelixNode | null;
  /** Screen position for overlay placement */
  screenPos: { x: number; y: number } | null;
  /** Which variation is hovered */
  variationId: string | null;
  /** Timestamp when hover started (for debouncing) */
  hoverStartTime: number;
  /** Whether overlay should be visible (after debounce) */
  overlayVisible: boolean;
}

const DEBOUNCE_MS = 120; // match plan: ~120ms overlay appearance

const initialState: HoverState = {
  node: null,
  screenPos: null,
  variationId: null,
  hoverStartTime: 0,
  overlayVisible: false,
};

type HoverAction =
  | { type: 'HOVER_START'; node: HelixNode; screenPos: { x: number; y: number }; variationId: string }
  | { type: 'HOVER_END' }
  | { type: 'TICK'; now: number };

export function hoverReducer(state: HoverState, action: HoverAction): HoverState {
  switch (action.type) {
    case 'HOVER_START': {
      return {
        node: action.node,
        screenPos: action.screenPos,
        variationId: action.variationId,
        hoverStartTime: Date.now(),
        overlayVisible: false, // will become true after debounce
      };
    }
    case 'HOVER_END': {
      return { ...initialState };
    }
    case 'TICK': {
      if (!state.node) return state;
      const elapsed = action.now - state.hoverStartTime;
      return {
        ...state,
        overlayVisible: elapsed >= DEBOUNCE_MS,
      };
    }
    default:
      return state;
  }
}

// ─── Helper to extract hover data from THREE.Mesh userData ───────────────────

export interface RaycastHit {
  nodeId: string;
  node: HelixNode;
  variationId: string;
  screenPos: { x: number; y: number };
}

export function extractHitData(
  mesh: THREE.Mesh | null,
  screenPos: { x: number; y: number } | null,
): RaycastHit | null {
  if (!mesh || !screenPos) return null;

  const { nodeId, node, variationId } = mesh.userData;
  if (!nodeId || !node || !variationId) return null;

  return {
    nodeId,
    node,
    variationId,
    screenPos,
  };
}
