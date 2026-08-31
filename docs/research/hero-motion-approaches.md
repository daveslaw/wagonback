# Hero Motion Approaches — Research

Fact-finding for issue #10 ("Research interactive hero motion approaches"), feeding decision ticket #12. This is research only — no recommendation, no implementation.

> **Note on location**: this repo has `docs/adr/` for architecture decisions, but this document isn't a decision — it's a survey of options. `docs/research/` is created here as a new, reasonably-named home for that kind of note; no existing repo convention covers it.

## Current implementation (baseline)

`components/ui/dot-shader-background.tsx`:

- A single React Three Fiber `<Canvas>` (`@react-three/fiber` ^9.5, `three` ^0.183) containing one full-screen `<mesh>` with a `planeGeometry` and a custom `shaderMaterial` (drei's `shaderMaterial` helper, defined at line 9 as `DotMaterial`).
- This is a **fragment-shader-only, post-processing-style effect** — no real 3D geometry or depth. The fragment shader (`sdfCircle`, line 50; grid built via `fract(rotatedUv * gridSize)`, line 61) draws a dot grid in 2D screen space, evaluated per-pixel.
- Grid density (`gridSize = 100`, line 107) and dot appearance driven by uniforms: `time`, `resolution`, `dotColor`/`bgColor` (theme-aware via `next-themes`).
- Mouse interaction uses drei's `useTrailTexture` hook (line 120): a **baked 2D trail texture** — cursor movement is written into an offscreen texture with fading/aging, and the fragment shader samples that texture per grid cell (`mouseTrail` uniform) to swell dot size/opacity near recent cursor positions. No raycasting against real geometry, no per-vertex work.
- One draw call, one plane, `gl={{ antialias: true, powerPreference: 'high-performance' }}`.
- Wired into `components/sections/Hero.tsx`: lazy-loaded via `next/dynamic` as `DotScreenShader`, and gated on `isMobile === false` — a comment (Hero.tsx line ~30) states the animation runs continuously regardless of the `isMobile` prop, so the component **must not mount at all** on mobile (not just be hidden), i.e. mobile skip is a hard performance guardrail, not a CSS toggle.

## What was found at the vengenceui reference URL

`https://www.vengenceui.com/components/wave-grid-background` **was fetchable and yielded concrete implementation detail** (not paywalled — full source visible/copyable on the page, also offered as a CLI install). Per the page:

- Built with **Three.js + custom GLSL**, described by the page itself as "a mouse-trail displacement shader, and a vignette / RGB-shift post pass."
- Renders a **40×40 InstancedMesh grid of cubes** — real 3D geometry, one instanced draw call, not a fragment-only 2D effect.
- **Custom vertex + fragment shaders** handle the wave deformation (vertex shader displaces instance geometry; fragment shader presumably handles shading/color).
- Mouse positions are **raycast onto a world-space plane**, and that hit position is written into a trail texture that drives **vertex displacement** (as opposed to the current site's fragment-only sampling).
- Exposed tuning props: `waveSpeed` (wavefront expansion speed, world units/sec), `waveAmplitude` (peak displacement multiplier), `waveFrequency` (spatial oscillation frequency), `autoAnimate` (emits gentle idle ripples when the cursor is inactive).
- Adds a **post-processing pass** (`EffectComposer` + `ShaderPass`) for vignette and RGB-shift, plus **PCF shadow mapping** for lighting — both additive cost centers beyond the base instanced-grid render.
- No pricing/licensing gate encountered.

This is close to a full spec of the reference effect: instanced cube grid + vertex-shader ripple driven by a raycast-fed trail texture + post-processing polish.

## Technique options

### Option A — InstancedMesh grid of cubes with per-instance ripple displacement

**Description**: Replace the flat shader plane with a `THREE.InstancedMesh` (or drei's declarative `<Instances>`/`<Instance>` wrapper) of N×N boxes, one draw call for the whole grid. Per-frame, either (a) update each instance's transform matrix in JS via `setMatrixAt`/a scratch `Object3D` dummy and set `instanceMatrix.needsUpdate = true`, or (b) push instance-varying data as a custom `InstancedBufferAttribute` and do the displacement math in a vertex shader on the GPU. This is the technique the vengenceui reference itself uses (40×40 instanced cubes).

- **Complexity**: Materially different from the current scaffolding. The existing `Canvas` + `shaderMaterial` pattern can be reused for the _material_, but the scene now needs real geometry (`boxGeometry`), an `InstancedMesh`/`<Instances>` object, and either per-frame CPU matrix math in a `useFrame` loop or a custom vertex shader with per-instance attributes. Not a drop-in modification of `dot-shader-background.tsx` — closer to a new component.
- **Performance tradeoffs**: Still a single draw call regardless of instance count (per Three.js docs and drei docs: "hundreds of thousands of objects in a single draw call"), but each instance is now real geometry with 8+ vertices vs. the current single 4-vertex plane, so vertex-shader load scales with instance count. If displacement is computed in JS per instance per frame (CPU path), that's `O(N²)` matrix math every frame — noticeably more CPU work than the current approach, which does zero CPU-side per-frame geometry work (everything is GPU fragment work on one plane). The GPU-attribute/vertex-shader path avoids the CPU cost but requires more shader complexity (vertex + fragment vs. fragment-only). Mobile: heavier than the current effect on both CPU (if using the JS matrix-update path) and GPU (real geometry, shadows/post-processing if added) — the existing project stance is a hard mobile skip for the _lighter_ current effect, so an instanced grid would need at least the same skip, and might warrant a lighter mobile variant (fewer instances, no shadows/post pass) rather than only binary on/off, if the goal shifts to no longer skipping visuals on mobile entirely.
- **Evolution of the look**: This is the option that most directly matches the wave-grid reference — moves from a flat 2D dot pattern to a real 3D grid with depth, and swaps "dots swelling in a 2D texture" for actual cubes rising/falling in a wave.
- Sources: [Three.js InstancedMesh docs](https://threejs.org/docs/index.html?q=InstancedMesh#api/en/objects/InstancedMesh), [Three.js dynamic instancing example](https://threejs.org/examples/#webgl_instancing_dynamic), [drei `<Instances>`/`<Instance>` docs](https://drei.docs.pmnd.rs/performances/instances) ("This allows you to define hundreds of thousands of objects in a single draw call, but declaratively" — also notes declarative instances carry more CPU overhead than raw `THREE.InstancedMesh` for large static counts), vengenceui page itself (https://www.vengenceui.com/components/wave-grid-background).

### Option B — Vertex-displacement heightfield on a single high-density plane

**Description**: Keep the current single-plane, single-draw-call scaffolding, but subdivide the `planeGeometry` into a dense grid of segments and add a **vertex shader** that displaces each vertex's Z (or Y) based on a wave function — distance from a mouse-position uniform, time, and wave rings (e.g. `sin(distance * frequency - time * speed) * amplitude`). The fragment shader stays similar to today's (dot/grid coloring), but now operates on real 3D relief instead of a flat 2D pattern.

- **Complexity**: A more incremental evolution of the existing `dot-shader-background.tsx` — same `Canvas`, same single mesh, same `shaderMaterial` scaffolding, same drei helpers. The main additions are (1) a higher-resolution `planeGeometry` (more segments = more vertices to displace), (2) a `vertexShader` string added to the existing `shaderMaterial` call (currently likely only a pass-through vertex shader), and (3) feeding a mouse-world-position uniform instead of/alongside the trail texture. Lower effort than Option A because it avoids instancing, per-instance matrices, and a second geometry type.
- **Performance tradeoffs**: Still one draw call, but vertex count now scales with grid resolution (fine detail requires many segments — e.g. a 100×100 segment plane is 10,201 vertices vs. 4 for the current plane), so GPU vertex-shader cost rises with density, while fragment cost is roughly comparable to today (still per-pixel). No CPU-side per-frame JS work is required (displacement computed entirely in the vertex shader from uniforms), which is lighter on the main thread than Option A's JS matrix-update path. Mobile: closer to the current effect's profile than Option A's real-cube-grid approach, since it's still one mesh/one material — plausibly compatible with the existing hard mobile skip, or could support a lower-resolution mobile variant (fewer segments) more cheaply than Option A could support a reduced-instance-count mobile variant.
- **Evolution of the look**: Adds real depth/relief to the existing dot-grid aesthetic without changing the fundamental "flat plane, fragment-driven" architecture — a middle ground between the current 2D dot swell and the reference's fully 3D instanced-cube ripple. Doesn't reproduce discrete cubes, but can reproduce concentric wave rings and cursor-driven ripple.
- Sources: [Three.js PlaneGeometry docs](https://threejs.org/docs/index.html?q=Plane#api/en/geometries/PlaneGeometry) (widthSegments/heightSegments control vertex density), [drei `shaderMaterial` helper](https://drei.docs.pmnd.rs/shaders/shader-material) (same helper already used in `dot-shader-background.tsx`), vengenceui page's description of vertex-shader-driven wave deformation as the mechanism for its own effect (https://www.vengenceui.com/components/wave-grid-background).

### Option C — Raycast-driven interaction vs. the existing `useTrailTexture` approach (comparison, not a standalone technique)

This isn't a third full technique so much as a documented alternative to how _either_ Option A or B gets its cursor input, worth calling out because it's explicitly the axis the reference implementation and the current site differ on.

- **Current approach (`useTrailTexture`)**: Per drei's docs, `useTrailTexture(config)` returns `[texture, onMove]` — a `THREE.Texture` that accumulates and fades pointer-move events, with parameters `size` (texture resolution, default 256×256), `radius` (trail thickness, default 0.3), `maxAge` (trail persistence, default 750ms), `interpolate`, `ease`, `intensity`, `smoothing`, `minForce`, `blend`. The documented usage pattern is exactly what's already in place: attach `onMove` to `onPointerMove` on the mesh, sample the returned texture in the shader (drei's own example uses it as a `displacementMap`, i.e. the same texture-driven-displacement idea the wave-grid reference uses). This is a **baked, resolution-limited, GPU-friendly texture** — cheap to sample per-fragment or per-vertex, decoupled from exact instance/vertex count, but limited to whatever the texture's `size` resolution captures.
- **Raycast-based alternative**: Instead of (or in addition to) a baked texture, use `useThree()` to get the camera/pointer and either rely on R3F's built-in pointer events (`onPointerMove` on a mesh, which R3F resolves via `Raycaster` under the hood) or a manual `Raycaster` in a `useFrame` loop to get a precise world-space intersection point every frame, then feed that point directly as a `vec3` uniform for exact analytic wave-ring math (as opposed to sampling a texture). This is effectively what the vengenceui reference does — "mouse positions are raycasted onto a world-space plane" and stored in a trail texture, so the reference actually **combines both**: raycast for precision, trail texture for temporal fade/persistence.
- **Tradeoff**: `useTrailTexture` alone (current approach) is simpler and already proven in this codebase; a bare uniform-per-frame raycast gives exact, unfaded cursor position but loses the "fading trail" persistence effect unless hand-rolled with additional easing/decay logic. The reference's raycast-plus-trail-texture combination is the more capable but also the more complex option, requiring both R3F's pointer/raycast machinery and drei's trail texture in the same component.
- Sources: [drei `useTrailTexture` docs](https://drei.docs.pmnd.rs/loaders/trail-texture-use-trail-texture), vengenceui page's own description of raycasting onto a world-space plane feeding a trail texture (https://www.vengenceui.com/components/wave-grid-background).

## Not included

A GPGPU/ping-pong-buffer particle approach (drei's `useFBO`) was considered per the task brief. `useFBO` is confirmed real and documented — "Creates a `THREE.WebGLRenderTarget`" for render-to-texture workflows, commonly used for GPGPU-style computation (per [drei's `useFBO` docs](https://drei.docs.pmnd.rs/misc/fbo-use-fbo)) — but the fetched docs didn't surface a ping-pong-specific code example or enough primary-source detail to write a properly sourced complexity/performance note without speculating beyond what was retrieved, and it wasn't discussed by the vengenceui reference at all (which uses instancing + vertex shaders, not GPGPU particles). Per the task brief's guidance to skip padding, it's omitted as a fourth option here rather than written up thinly.

## Source list

- Three.js `InstancedMesh` docs: https://threejs.org/docs/index.html?q=InstancedMesh#api/en/objects/InstancedMesh
- Three.js dynamic instancing example: https://threejs.org/examples/#webgl_instancing_dynamic
- Three.js `PlaneGeometry` docs: https://threejs.org/docs/index.html?q=Plane#api/en/geometries/PlaneGeometry
- drei `<Instances>`/`<Instance>` docs: https://drei.docs.pmnd.rs/performances/instances
- drei `shaderMaterial` docs: https://drei.docs.pmnd.rs/shaders/shader-material
- drei `useTrailTexture` docs: https://drei.docs.pmnd.rs/loaders/trail-texture-use-trail-texture
- drei `useFBO` docs: https://drei.docs.pmnd.rs/misc/fbo-use-fbo
- Reference component: https://www.vengenceui.com/components/wave-grid-background
- Current implementation (this repo): `components/ui/dot-shader-background.tsx`, `components/sections/Hero.tsx`
