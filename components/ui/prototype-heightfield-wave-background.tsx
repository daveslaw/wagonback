'use client'

// PROTOTYPE — throwaway. Answers wayfinder ticket #12 ("Prototype hero visual & motion
// direction"): Option B from the research (docs/research/hero-motion-approaches.md) —
// vertex-displacement heightfield on a dense single plane, evolving the existing
// dot-shader-background.tsx scaffolding instead of replacing it with instanced geometry.

import { useMemo, useEffect } from 'react'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import * as THREE from 'three'

const WaveMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    accentA: new THREE.Color('#00c8ff'),
    accentB: new THREE.Color('#5b4fff'),
    bgColor: new THREE.Color('#0a0e14'),
    mouseTrail: null,
    gridSize: 42,
  },
  /* glsl */ `
    uniform sampler2D mouseTrail;
    uniform float time;
    uniform float gridSize;
    varying float vHeight;
    varying vec2 vGridUv;

    void main() {
      vec2 uv = uv;
      vGridUv = uv;

      // sample the accumulated mouse-trail texture for displacement, same primitive
      // the current dot shader already uses for its 2D swell — reused here to drive
      // real Z displacement instead of a fragment-only fake
      float trail = texture2D(mouseTrail, uv).r;

      // gentle idle ripple so the surface isn't dead when the cursor is away
      float idle = sin(uv.x * 14.0 - time * 0.6) * cos(uv.y * 14.0 - time * 0.4) * 0.05;

      float height = trail * 0.9 + idle;
      vHeight = height;

      vec3 displaced = position + normal * height;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,
  /* glsl */ `
    uniform vec3 accentA;
    uniform vec3 accentB;
    uniform vec3 bgColor;
    uniform float gridSize;
    varying float vHeight;
    varying vec2 vGridUv;

    void main() {
      vec2 grid = fract(vGridUv * gridSize);
      float line = 1.0 - smoothstep(0.0, 0.04, min(grid.x, grid.y));

      vec3 accent = mix(accentA, accentB, clamp(vGridUv.x + vHeight * 0.6, 0.0, 1.0));
      float glow = clamp(vHeight * 2.2, 0.0, 1.0);

      vec3 composition = mix(bgColor, accent, line * 0.35 + glow * 0.5);
      gl_FragColor = vec4(composition, 1.0);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
)

function Scene() {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.15,
    maxAge: 600,
    interpolate: 1,
    ease: (x: number) =>
      x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
  })

  const waveMaterial = useMemo(() => new WaveMaterial(), [])

  useEffect(() => {
    waveMaterial.uniforms.mouseTrail.value = trail
  }, [trail, waveMaterial])

  useFrame((state) => {
    waveMaterial.uniforms.time.value = state.clock.elapsedTime
  })

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => onMove(e)

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={handlePointerMove}>
      {/* dense segment count is the whole trick here — vertex shader needs
          real vertices to displace, unlike the 4-vertex plane in the current effect */}
      <planeGeometry args={[2, 2, 160, 160]} />
      <primitive
        object={waveMaterial}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
      />
    </mesh>
  )
}

export const HeightfieldWaveBackground = () => {
  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
      }}
    >
      <Scene />
    </Canvas>
  )
}
