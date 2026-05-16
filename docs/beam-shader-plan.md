# VolumetricBeam — Three.js fragment-shader rewrite

> Queued plan. Not active. Implement only if the current Canvas 2D
> implementation + Fix 7's CSS mask still doesn't get the look San wants
> after a few iteration passes on the live page.

## Context

The current `src/components/VolumetricBeam.tsx` is a ~330-line Canvas 2D
implementation. It renders the beam with `fillRect` calls into an
offscreen low-res buffer, then composites multiple layers (haze, fog,
inner glow, filament bundle, origin halo, landing pool, ground streak)
onto the main canvas using `globalCompositeOperation = "lighter"`.

That approach has two structural problems no amount of patching fully
removes:

1. **Rectangles have edges.** Every fillRect carries the risk of a hard
   horizontal seam if its bounding box clips a gradient that still has
   non-zero alpha at the edge. Fix 1 and Fix 7 (in the active beam plan)
   mitigate this, but future tweaks can reintroduce the bug.
2. **No real per-pixel math.** Soft falloffs, noise turbulence, and
   colour shifts are all approximated by chained gradient stops on
   shapes the size of viewports. The render loop costs grow with every
   composite layer because the CPU has to evaluate gradients for each
   pixel touched.

A fragment shader running on the GPU sidesteps both. Every pixel is a
continuous mathematical value with no rectangle ever drawn.

## Architecture

- **One Three.js scene, one fullscreen quad.** A `THREE.PlaneGeometry`
  sized to the canvas, mounted in an orthographic camera so screen
  coords map 1:1 to UVs.
- **One fragment shader** that takes `uTime`, `uHeroRatio`,
  `uIntensity`, `uPulsePos`, and a few palette uniforms, and outputs the
  beam colour + alpha for that pixel.
- **One vertex shader** — trivial passthrough.
- **WebGLRenderer with `alpha: true` and `premultipliedAlpha: false`**
  so the canvas can be composited over the page with `blendFunc(SRC_ALPHA,
  ONE_MINUS_SRC_ALPHA)`.

## Shader sketch

```glsl
// fragment
precision highp float;
uniform float uTime, uHeroRatio, uIntensity, uPulsePos;
uniform vec3  uCore, uGlow, uDeep, uHaze, uMuted;
varying vec2  vUv;

// Domain-warped sine noise (cheap, smooth, no texture sampling)
float n(vec2 p) {
  return sin(p.x * 6.0 + uTime * 0.18 + sin(p.y * 4.0) * 1.2) * 0.5 + 0.5;
}

void main() {
  float u = vUv.x;            // 0..1 across the canvas
  float v = vUv.y;            // 0..1 down the canvas (0=top, 1=bottom)
  float t = v;                // beam-axis position

  // 1. Piecewise width — narrow shaft, wide plume, mega flare
  float widthFrac;
  if (t < 0.42)      widthFrac = 0.08 + (t / 0.42) * 0.12;
  else if (t < 0.72) widthFrac = 0.20 + pow((t - 0.42) / 0.30, 2.0) * 0.12;
  else               widthFrac = 0.32 + pow((t - 0.72) / 0.28, 1.2) * 0.18;

  // 2. Ragged frock noise on bottom half
  float frock = smoothstep(0.5, 1.0, t) * sin(t * 8.0 + uTime * 0.3) * 0.12;
  widthFrac += frock;

  // 3. Distance from beam centreline, normalised to widthFrac
  float dx = abs(u - 0.5) / widthFrac;

  // 4. Lateral falloff — smoothstep gives a perfectly soft edge
  float lateral = 1.0 - smoothstep(0.0, 1.0, dx);

  // 5. Vertical fade — strong in hero, dies smoothly past heroRatio
  float vertical = mix(
    pow(t, 0.45) * (1.0 - 0.3 * pow(t, 3.0)),
    0.0,
    smoothstep(uHeroRatio, 1.0, v)
  );

  // 6. Turbulence
  float turb = mix(0.7, 1.3, n(vec2(t * 3.0, t * 11.0)));

  // 7. Pulse — Gaussian centred on uPulsePos
  float pulse = exp(-pow((t - uPulsePos) * 12.0, 2.0));

  // 8. Compose alpha + colour
  float a = lateral * vertical * turb * (1.0 + pulse * 0.7) * uIntensity;
  float f = smoothstep(uHeroRatio, 1.0, v);
  vec3  col = mix(mix(uDeep, uGlow, 0.5), uMuted, f);

  gl_FragColor = vec4(col, a);
}
```

That ~40 lines of shader replaces ~280 lines of Canvas 2D `fillRect`
calls and produces a continuously soft, math-correct beam at GPU speed.

## What stays vs what changes

**Stays**
- `<VolumetricBeam />` component API — same props (`hue`, `intensity`,
  `bottomSpread`, `lavaOverlap`).
- Mount in `page.tsx` — still wrapped in the mask div from Fix 7
  (defence-in-depth even though the shader doesn't need it).
- Surge pulse semantics, lava-lamp drift timing, palette names.

**Changes**
- Replace the Canvas 2D `useEffect` body with a Three.js setup:
  `WebGLRenderer`, `Scene`, `OrthographicCamera`, `PlaneGeometry`,
  `ShaderMaterial`. Single `Mesh`.
- The render loop sets uniforms and calls `renderer.render(scene,
  camera)`. No more offscreen buffer, no more compositing passes.
- Resize handler resizes the renderer to viewport × `(1 + lavaOverlap)`.

## File touch list

- `src/components/VolumetricBeam.tsx` — full rewrite, ~150 lines TS +
  inline GLSL string literals.
- `src/components/VolumetricBeam.glsl.ts` (new, optional) — extract the
  vertex/fragment shaders into a tagged-template literal export to keep
  the component file readable.
- `package.json` — no new deps. `three` is already installed.
- `CHANGES.md` — entry.

## Risks

- **Mobile fragment performance.** A fullscreen-quad shader running per
  frame is cheap but not free on low-end Android. Add a one-time GPU
  budget check (`renderer.getContext().getParameter(MAX_TEXTURE_SIZE)`
  ≥ 4096) and fall back to the static frame on weak GPUs.
- **Shader determinism.** GLSL `sin()` precision varies between drivers;
  if the lava-lamp drift looks different on Firefox vs Chrome,
  precompute noise into a 256×256 RGBA texture and sample.
- **WebGL context loss.** Listen for `webglcontextlost` and attempt a
  single `restoreContext` retry; on failure, mount a static fallback
  image.

## Verification

1. `npm run dev` → `/`. Beam renders identically (within perception) to
   the post-fix Canvas 2D version, but with no visible seams under any
   resize / scroll behaviour.
2. DevTools Performance: render frame cost drops from ~2-4 ms (Canvas
   2D) to <0.5 ms (GPU).
3. Toggle `prefers-reduced-motion` → static frame (no RAF).
4. Open in Firefox + Safari + a mobile device → same visual, no driver
   artefacts.
5. Append a `CHANGES.md` entry.
