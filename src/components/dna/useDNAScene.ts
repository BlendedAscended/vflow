// ─── DNA Triptych: scene hook ────────────────────────────────────────────────
// Manages renderer, scene, camera, RAF loop, resize, and IntersectionObserver pause.

'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { VARIATIONS, ANIMATION } from './variations';
import { buildHelix, disposeHelix, type BuiltHelix } from './buildHelix';

interface UseDNASceneOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onHoverNode?: (node: THREE.Mesh | null, screenPos: { x: number; y: number } | null) => void;
  enabled?: boolean;
}

export function useDNAScene({ canvasRef, onHoverNode, enabled = true }: UseDNASceneOptions) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const helicesRef = useRef<BuiltHelix[]>([]);
  const rafRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());
  const pausedRef = useRef(false);
  const hoveredHelixRef = useRef<number>(-1);
  const currentSpeedRef = useRef<number>(ANIMATION.rotationSpeed);

  // ─── Init ──────────────────────────────────────────────────────────────────

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a2e, ANIMATION.fogDensityStart);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa5d6a7, 1.5, 20);
    pointLight.position.set(0, 3, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x66bb6a, 0.8, 15);
    pointLight2.position.set(-3, -2, 4);
    scene.add(pointLight2);

    // Build helices
    VARIATIONS.forEach((variation) => {
      const built = buildHelix(variation);
      // Start small for entry animation
      built.group.scale.set(1, 0.2, 1);
      built.group.userData.entryComplete = false;
      scene.add(built.group);
      helicesRef.current.push(built);
    });

    // Resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // IntersectionObserver: pause off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current = !entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    io.observe(canvas);

    // prefers-reduced-motion
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      pausedRef.current = true;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      io.disconnect();
      helicesRef.current.forEach(disposeHelix);
      helicesRef.current = [];
      renderer.dispose();
    };
  }, [canvasRef]);

  // ─── RAF loop ──────────────────────────────────────────────────────────────

  const animate = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate);

    if (pausedRef.current) return;

    const delta = clockRef.current.getDelta();
    const elapsed = clockRef.current.getElapsedTime();

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!scene || !camera || !renderer) return;

    // Fog entry animation
    if (scene.fog instanceof THREE.FogExp2 && elapsed < ANIMATION.fogDuration + 0.5) {
      const fogT = Math.min(elapsed / ANIMATION.fogDuration, 1);
      scene.fog.density = THREE.MathUtils.lerp(
        ANIMATION.fogDensityStart,
        ANIMATION.fogDensityEnd,
        fogT,
      );
    }

    // Smooth speed transition for hover
    const targetSpeed = hoveredHelixRef.current >= 0 ? ANIMATION.hoverSpeed : ANIMATION.rotationSpeed;
    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetSpeed,
      delta / ANIMATION.hoverTransition,
    );

    // Update each helix
    helicesRef.current.forEach((built, idx) => {
      const { group } = built;

      // Entry animation: scale in with stagger
      const entryDelay = ANIMATION.staggerDelay * idx;
      if (!group.userData.entryComplete && elapsed > entryDelay) {
        const entryT = Math.min(
          (elapsed - entryDelay) / ANIMATION.scaleInDuration,
          1,
        );
        const eased = 1 - Math.pow(1 - entryT, 3); // power3.out
        group.scale.y = THREE.MathUtils.lerp(0.2, 1, eased);
        if (entryT >= 1) {
          group.userData.entryComplete = true;
          group.scale.y = 1;
        }
      }

      // Rotation
      group.rotation.y += currentSpeedRef.current * delta;

      // Float
      const floatY = Math.sin(elapsed * (Math.PI * 2 / ANIMATION.floatPeriod) + idx * 0.5)
        * ANIMATION.floatAmplitude;
      group.position.y = floatY;
    });

    // Camera nudge toward hovered helix
    if (hoveredHelixRef.current >= 0) {
      const targetX = VARIATIONS[hoveredHelixRef.current].offsetX * 0.1;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3);
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 2);
    }

    renderer.render(scene, camera);
  }, []);

  // ─── Hover detection ───────────────────────────────────────────────────────

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !cameraRef.current) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Collect all node meshes
      const allNodes: THREE.Mesh[] = [];
      helicesRef.current.forEach((built) => {
        allNodes.push(...built.nodeMeshes);
      });

      const intersects = raycasterRef.current.intersectObjects(allNodes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const variationId = hit.userData.variationId;
        const helixIdx = VARIATIONS.findIndex((v) => v.id === variationId);
        hoveredHelixRef.current = helixIdx;

        // Project to screen coords
        const worldPos = new THREE.Vector3();
        hit.getWorldPosition(worldPos);
        worldPos.project(cameraRef.current);
        const screenX = ((worldPos.x + 1) / 2) * rect.width + rect.left;
        const screenY = ((-worldPos.y + 1) / 2) * rect.height + rect.top;

        onHoverNode?.(hit, { x: screenX, y: screenY });
      } else {
        hoveredHelixRef.current = -1;
        onHoverNode?.(null, null);
      }
    },
    [canvasRef, onHoverNode],
  );

  const handlePointerLeave = useCallback(() => {
    hoveredHelixRef.current = -1;
    onHoverNode?.(null, null);
  }, [onHoverNode]);

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!enabled) return;
    const cleanup = init();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      cleanup?.();
    };
  }, [enabled, init, animate]);

  return {
    handlePointerMove,
    handlePointerLeave,
  };
}
