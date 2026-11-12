'use client'

// Instanced-grid hero background — evolves the former dot-shader effect (see ADR 0003
// and docs/research/hero-motion-approaches.md on branch research/hero-motion-approaches
// for the technique comparison this replaced). Real 3D geometry, one instanced draw
// call; per-instance transforms are updated in JS each frame (see research doc for the
// CPU-cost tradeoff this accepts in exchange for simplicity).

import { useMemo, useRef } from 'react'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GRID = 36
const SPACING = 0.12
const ACCENT_A = new THREE.Color('#00c8ff')
const ACCENT_B = new THREE.Color('#5b4fff')

function CubeGrid() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const mouse = useRef(new THREE.Vector2(999, 999))
  const lastMoveTime = useRef(-999)
  const justMoved = useRef(false)
  const tmpColor = useMemo(() => new THREE.Color(), [])

  const positions = useMemo(() => {
    const half = (GRID - 1) / 2
    const pts: [number, number][] = []
    for (let ix = 0; ix < GRID; ix++) {
      for (let iy = 0; iy < GRID; iy++) {
        pts.push([(ix - half) * SPACING, (iy - half) * SPACING])
      }
    }
    return pts
  }, [])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    if (justMoved.current) {
      lastMoveTime.current = t
      justMoved.current = false
    }
    const sinceMove = t - lastMoveTime.current
    const idleFade = THREE.MathUtils.clamp(sinceMove - 0.4, 0, 1)

    positions.forEach(([x, y], i) => {
      const dx = x - mouse.current.x
      const dy = y - mouse.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // wavefront driven by cursor position + a slow idle ripple that fades in once
      // the cursor's been still, mirroring the researched reference's "autoAnimate"
      const cursorWave =
        Math.exp(-dist * dist * 3) * Math.sin(dist * 10 - t * 4) * (1 - idleFade * 0.85)
      const idleWave = Math.sin(x * 3 + t * 0.8) * Math.cos(y * 3 - t * 0.6) * 0.12 * idleFade

      const height = cursorWave * 0.35 + idleWave

      dummy.position.set(x, y, height)
      dummy.scale.set(1, 1, 1 + Math.abs(height) * 2)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      tmpColor.copy(ACCENT_A).lerp(ACCENT_B, THREE.MathUtils.clamp(height * 3 + 0.5, 0, 1))
      mesh.setColorAt(i, tmpColor)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    mouse.current.set(e.point.x, e.point.y)
    justMoved.current = true
  }

  return (
    <>
      {/* invisible catcher plane, sized generously so the raycast always hits something */}
      <mesh position={[0, 0, -0.5]} onPointerMove={handlePointerMove} visible={false}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
        <boxGeometry args={[SPACING * 0.72, SPACING * 0.72, 0.06]} />
        <meshStandardMaterial roughness={0.35} metalness={0.4} />
      </instancedMesh>
    </>
  )
}

export const CubeGridBackground = () => {
  return (
    <Canvas
      camera={{ position: [0, -2.4, 2.6], fov: 45 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} color="#e8f4ff" />
      <directionalLight position={[-2, -1, 2]} intensity={0.4} color="#5b4fff" />
      <CubeGrid />
    </Canvas>
  )
}
