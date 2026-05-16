// ─── DNA Triptych: pure geometry builder ─────────────────────────────────────
// Builds a THREE.Group from a HelixVariation config.
// No side effects, no mutation of input, fully deterministic.

import * as THREE from 'three';
import type { HelixVariation, HelixNode } from './variations';

// ─── Shared materials (lazy-init, reused across helices) ─────────────────────

const _materialCache = new Map<string, THREE.Material>();

function getBackboneMaterial(color: string): THREE.LineBasicMaterial {
  const key = `backbone-${color}`;
  if (!_materialCache.has(key)) {
    _materialCache.set(key, new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    }));
  }
  return _materialCache.get(key) as THREE.LineBasicMaterial;
}

function getNodeMaterial(color: string, emissive: number): THREE.MeshStandardMaterial {
  const key = `node-${color}-${emissive}`;
  if (!_materialCache.has(key)) {
    _materialCache.set(key, new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.95,
    }));
  }
  return _materialCache.get(key) as THREE.MeshStandardMaterial;
}

function getRungMaterial(color: string, style: 'capsule' | 'glass'): THREE.Material {
  const key = `rung-${color}-${style}`;
  if (!_materialCache.has(key)) {
    if (style === 'capsule') {
      _materialCache.set(key, new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        transmission: 0.6,
        thickness: 0.5,
        roughness: 0.1,
        metalness: 0.0,
      }));
    } else {
      _materialCache.set(key, new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        transmission: 0.8,
        thickness: 0.3,
        roughness: 0.05,
        metalness: 0.0,
      }));
    }
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
      emissiveIntensity: 0.3,
      metalness: 0.1,
      roughness: 0.6,
    }));
  }
  return _materialCache.get(key) as THREE.MeshStandardMaterial;
}

// ─── Helix math ──────────────────────────────────────────────────────────────

const HELIX_CYCLES = 4;
const HELIX_HEIGHT = 8; // scene units
const HELIX_SEGMENTS = 120;

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
    const x = Math.sin(angle) * amplitude * 0.01; // scale amplitude to scene units
    const y = (t - 0.5) * HELIX_HEIGHT;
    const z = Math.cos(angle) * amplitude * 0.01;
    points.push({ x, y, z, t });
  }
  return points;
}

// ─── Backbone strands ────────────────────────────────────────────────────────

function buildBackbone(amplitude: number, color: string): THREE.Group {
  const group = new THREE.Group();
  const mat = getBackboneMaterial(color);

  // Strand A (phase 0)
  const ptsA = computeHelixPoints(amplitude, 0);
  const geomA = new THREE.BufferGeometry().setFromPoints(
    ptsA.map(p => new THREE.Vector3(p.x, p.y, p.z))
  );
  group.add(new THREE.Line(geomA, mat));

  // Strand B (phase PI)
  const ptsB = computeHelixPoints(amplitude, Math.PI);
  const geomB = new THREE.BufferGeometry().setFromPoints(
    ptsB.map(p => new THREE.Vector3(p.x, p.y, p.z))
  );
  group.add(new THREE.Line(geomB, mat));

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

    const ax = Math.sin(angleA) * amplitude * 0.01;
    const ay = (t - 0.5) * HELIX_HEIGHT;
    const az = Math.cos(angleA) * amplitude * 0.01;

    const bx = Math.sin(angleB) * amplitude * 0.01;
    const by = ay;
    const bz = Math.cos(angleB) * amplitude * 0.01;

    if (style === 'capsule') {
      // Cylinder between the two points
      const start = new THREE.Vector3(ax, ay, az);
      const end = new THREE.Vector3(bx, by, bz);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const len = start.distanceTo(end);

      const geom = new THREE.CylinderGeometry(0.02, 0.02, len, 8, 1);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(mid);
      mesh.lookAt(end);
      mesh.rotateX(Math.PI / 2);
      group.add(mesh);

      // Caps at each end
      const capGeom = new THREE.SphereGeometry(0.025, 8, 8);
      const capA = new THREE.Mesh(capGeom, mat);
      capA.position.copy(start);
      group.add(capA);

      const capB = new THREE.Mesh(capGeom, mat);
      capB.position.copy(end);
      group.add(capB);
    } else {
      // Thin glass line
      const points = [new THREE.Vector3(ax, ay, az), new THREE.Vector3(bx, by, bz)];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      group.add(new THREE.Line(geom, mat));
    }
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
    const x = Math.sin(angleA) * variation.amplitude * 0.01;
    const y = (node.t - 0.5) * HELIX_HEIGHT;
    const z = Math.cos(angleA) * variation.amplitude * 0.01;

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

    const baseX = Math.sin(angle) * amplitude * 0.01;
    const baseY = (t - 0.5) * HELIX_HEIGHT;
    const baseZ = Math.cos(angle) * amplitude * 0.01;

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
