// ─── DNA Triptych: pure geometry builder ─────────────────────────────────────
// Builds a THREE.Group from a HelixVariation config.
// No side effects, no mutation of input, fully deterministic.

import * as THREE from 'three';
import type { HelixVariation, HelixNode } from './variations';

// ─── Shared materials (lazy-init, reused across helices) ─────────────────────

const _materialCache = new Map<string, THREE.Material>();

// Backbone — emissive standard so the tube glows. NOT LineBasicMaterial
// (WebGL ignores linewidth on most platforms, lines render as 1px hairlines).
function getBackboneMaterial(color: string): THREE.MeshStandardMaterial {
  const key = `backbone-${color}`;
  if (!_materialCache.has(key)) {
    _materialCache.set(key, new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.9,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    }));
  }
  return _materialCache.get(key) as THREE.MeshStandardMaterial;
}

function getNodeMaterial(color: string, emissive: number): THREE.MeshStandardMaterial {
  const key = `node-${color}-${emissive}`;
  if (!_materialCache.has(key)) {
    _materialCache.set(key, new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: Math.max(emissive, 1.0),
      metalness: 0.3,
      roughness: 0.35,
      transparent: false,
    }));
  }
  return _materialCache.get(key) as THREE.MeshStandardMaterial;
}

// Rungs — emissive standard, NOT physical/transmission. Transmission needs an
// envMap to render as glass; without one it renders as nothing.
function getRungMaterial(color: string, style: 'capsule' | 'glass'): THREE.Material {
  const key = `rung-${color}-${style}`;
  if (!_materialCache.has(key)) {
    const isGlass = style === 'glass';
    _materialCache.set(key, new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: isGlass ? 0.5 : 0.7,
      metalness: 0.2,
      roughness: isGlass ? 0.15 : 0.3,
      transparent: true,
      opacity: isGlass ? 0.6 : 0.85,
    }));
  }
  return _materialCache.get(key) as THREE.Material;
}

function getOrbMaterial(color: string, opacity: number): THREE.MeshStandardMaterial {
  const key = `orb-${color}-${opacity}`;
  if (!_materialCache.has(key)) {
    _materialCache.set(key, new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity,
      emissive: color,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.4,
    }));
  }
  return _materialCache.get(key) as THREE.MeshStandardMaterial;
}

// Additive halo material — billboard sprite around each node so the emissive
// reads as bloom even without a post-processing pass. Color tinted to the
// helix accent. Uses a radial-falloff canvas texture generated once.
let _haloTexture: THREE.Texture | null = null;
function getHaloTexture(): THREE.Texture {
  if (_haloTexture) return _haloTexture;
  const size = 128;
  const cvs = document.createElement('canvas');
  cvs.width = size;
  cvs.height = size;
  const c = cvs.getContext('2d')!;
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.18)');
  g.addColorStop(1.0, 'rgba(255,255,255,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  _haloTexture = new THREE.CanvasTexture(cvs);
  _haloTexture.colorSpace = THREE.SRGBColorSpace;
  return _haloTexture;
}

function getHaloMaterial(color: string): THREE.SpriteMaterial {
  const key = `halo-${color}`;
  if (!_materialCache.has(key)) {
    _materialCache.set(key, new THREE.SpriteMaterial({
      map: getHaloTexture(),
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
  }
  return _materialCache.get(key) as THREE.SpriteMaterial;
}

// ─── Helix math ──────────────────────────────────────────────────────────────

const HELIX_CYCLES = 4;
const HELIX_HEIGHT = 8; // scene units
const HELIX_SEGMENTS = 120;
// Amplitude scale: variations.ts stores amplitude in pixels-ish (35-45). At
// 0.01 the helices were ~0.4 scene units wide — invisibly thin. 0.025 gives
// ~1.0 unit wide, which reads properly inside a 12-unit camera frustum.
const AMP_SCALE = 0.025;

interface HelixPoint {
  x: number;
  y: number;
  z: number;
  t: number;
}

function computeHelixPoints(amplitude: number, phaseOffset: number): HelixPoint[] {
  const points: HelixPoint[] = [];
  for (let i = 0; i <= HELIX_SEGMENTS; i++) {
    const t = i / HELIX_SEGMENTS;
    const angle = t * HELIX_CYCLES * Math.PI * 2 + phaseOffset;
    const x = Math.sin(angle) * amplitude * AMP_SCALE; // scale amplitude to scene units
    const y = (t - 0.5) * HELIX_HEIGHT;
    const z = Math.cos(angle) * amplitude * AMP_SCALE;
    points.push({ x, y, z, t });
  }
  return points;
}

// ─── Backbone strands ────────────────────────────────────────────────────────

function buildBackbone(amplitude: number, color: string): THREE.Group {
  const group = new THREE.Group();
  const mat = getBackboneMaterial(color);

  // Build each strand as a TubeGeometry along a CatmullRomCurve3. This
  // gives real thickness and accepts emissive shading — LineBasicMaterial
  // does neither (linewidth is ignored in WebGL).
  const buildStrand = (phase: number) => {
    const pts = computeHelixPoints(amplitude, phase).map(
      p => new THREE.Vector3(p.x, p.y, p.z),
    );
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    // Tube radius scales with amplitude so wider helices have proportionally
    // thicker strands.
    const tubeRadius = Math.max(0.025, amplitude * AMP_SCALE * 0.06);
    const geom = new THREE.TubeGeometry(curve, HELIX_SEGMENTS, tubeRadius, 8, false);
    group.add(new THREE.Mesh(geom, mat));
  };

  buildStrand(0);
  buildStrand(Math.PI);

  return group;
}

// ─── Rungs ───────────────────────────────────────────────────────────────────

function buildRungs(
  amplitude: number,
  count: number,
  style: 'capsule' | 'glass',
  color: string,
): THREE.Group {
  const group = new THREE.Group();
  if (count <= 0) return group;

  const mat = getRungMaterial(color, style);
  const spacing = 1 / (count + 1);

  for (let i = 1; i <= count; i++) {
    const t = i * spacing;
    const angleA = t * HELIX_CYCLES * Math.PI * 2;
    const angleB = angleA + Math.PI;

    const ax = Math.sin(angleA) * amplitude * AMP_SCALE;
    const ay = (t - 0.5) * HELIX_HEIGHT;
    const az = Math.cos(angleA) * amplitude * AMP_SCALE;

    const bx = Math.sin(angleB) * amplitude * AMP_SCALE;
    const by = ay;
    const bz = Math.cos(angleB) * amplitude * AMP_SCALE;

    const start = new THREE.Vector3(ax, ay, az);
    const end = new THREE.Vector3(bx, by, bz);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const len = start.distanceTo(end);

    // Both styles now use cylinders — Line elements with emissive standard
    // material don't behave (lines aren't shaded). Glass style just runs
    // thinner with a more translucent material.
    const radius = style === 'capsule' ? 0.05 : 0.028;
    const geom = new THREE.CylinderGeometry(radius, radius, len, 12, 1);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(mid);
    mesh.lookAt(end);
    mesh.rotateX(Math.PI / 2);
    group.add(mesh);

    // End caps so the rung reads as a capsule, not a stubby cylinder
    const capGeom = new THREE.SphereGeometry(radius * 1.05, 10, 10);
    const capA = new THREE.Mesh(capGeom, mat);
    capA.position.copy(start);
    group.add(capA);
    const capB = new THREE.Mesh(capGeom, mat);
    capB.position.copy(end);
    group.add(capB);
  }

  return group;
}

// ─── Nodes ───────────────────────────────────────────────────────────────────

function buildNodes(
  variation: HelixVariation,
): THREE.Group {
  const group = new THREE.Group();
  const mat = getNodeMaterial(variation.accentColor, variation.emissive);

  for (const node of variation.nodes) {
    const angleA = node.t * HELIX_CYCLES * Math.PI * 2;
    const x = Math.sin(angleA) * variation.amplitude * AMP_SCALE;
    const y = (node.t - 0.5) * HELIX_HEIGHT;
    const z = Math.cos(angleA) * variation.amplitude * AMP_SCALE;

    let geom: THREE.BufferGeometry;

    switch (variation.nodeStyle) {
      case 'puck': {
        geom = new THREE.CylinderGeometry(
          variation.nodeRadius * 0.3,
          variation.nodeRadius * 0.3,
          variation.nodeRadius * 0.1,
          16,
        );
        break;
      }
      case 'flask': {
        geom = new THREE.CapsuleGeometry(
          variation.nodeRadius * 0.2,
          variation.nodeRadius * 0.3,
          8,
          16,
        );
        break;
      }
      case 'orb':
      default: {
        geom = new THREE.SphereGeometry(variation.nodeRadius * 0.25, 16, 16);
        break;
      }
    }

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {
      nodeId: `${variation.id}-${node.label}`,
      node,
      variationId: variation.id,
    };
    group.add(mesh);

    // Glow ring around node
    const ringGeom = new THREE.RingGeometry(
      variation.nodeRadius * 0.3,
      variation.nodeRadius * 0.45,
      24,
    );
    const ringMat = new THREE.MeshBasicMaterial({
      color: variation.accentColor,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.set(x, y, z);
    ring.lookAt(0, y, 0); // face camera roughly
    group.add(ring);
  }

  return group;
}

// ─── Orb cloud (V3 only) ─────────────────────────────────────────────────────

function buildOrbCloud(
  amplitude: number,
  config: NonNullable<HelixVariation['orbCloud']>,
  color: string,
): THREE.Group {
  const group = new THREE.Group();
  const mat = getOrbMaterial(color, config.opacity);

  // Deterministic pseudo-random offsets using sine hash
  const seed = 42;
  for (let i = 0; i < config.count; i++) {
    const t = (i + 0.5) / config.count;
    const angle = t * HELIX_CYCLES * Math.PI * 2;

    // Pseudo-random offset
    const hash = Math.sin(seed + i * 127.1) * 43758.5453;
    const rx = (hash % 1) * 0.5 - 0.25;
    const ry = Math.sin(seed + i * 269.5) * 0.3;
    const rz = Math.cos(seed + i * 311.7) * 0.5 - 0.25;

    const baseX = Math.sin(angle) * amplitude * AMP_SCALE;
    const baseY = (t - 0.5) * HELIX_HEIGHT;
    const baseZ = Math.cos(angle) * amplitude * AMP_SCALE;

    const radius = config.minRadius + (hash % 1) * (config.maxRadius - config.minRadius);
    const geom = new THREE.SphereGeometry(radius * 0.15, 12, 12);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(baseX + rx, baseY + ry, baseZ + rz);
    group.add(mesh);
  }

  return group;
}

// ─── Main builder ────────────────────────────────────────────────────────────

export interface BuiltHelix {
  group: THREE.Group;
  nodeMeshes: THREE.Mesh[];
  variation: HelixVariation;
}

export function buildHelix(variation: HelixVariation): BuiltHelix {
  const group = new THREE.Group();
  group.position.x = variation.offsetX;

  // Backbone
  if (variation.showBackbone) {
    group.add(buildBackbone(variation.amplitude, variation.accentColor));
  }

  // Rungs
  if (variation.rungStyle !== 'none') {
    group.add(buildRungs(variation.amplitude, variation.rungCount, variation.rungStyle, variation.accentColor));
  }

  // Nodes
  const nodesGroup = buildNodes(variation);
  group.add(nodesGroup);

  // Orb cloud
  if (variation.orbCloud) {
    group.add(buildOrbCloud(variation.amplitude, variation.orbCloud, variation.accentColor));
  }

  // Collect node meshes for raycasting
  const nodeMeshes: THREE.Mesh[] = [];
  nodesGroup.traverse((child) => {
    if (child instanceof THREE.Mesh && child.userData.nodeId) {
      nodeMeshes.push(child);
    }
  });

  return { group, nodeMeshes, variation };
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

export function disposeHelix(built: BuiltHelix): void {
  built.group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      // Don't dispose shared materials
    }
  });
}
