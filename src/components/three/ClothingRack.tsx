'use client'

import { Suspense, useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { ContactShadows, useTexture } from '@react-three/drei'
import type { Product } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import ClothingRackFallback from './ClothingRackFallback'

interface ClothingRackProps {
  products: Product[]
  activeIndex: number
  onActiveChange: (index: number) => void
  onOpenProduct: (product: Product) => void
  isVisible?: boolean
}

const TAU = Math.PI * 2
const RACK_RADIUS = 3.05
const RAIL_HEIGHT = 2.15
const GARMENT_HEIGHT = 2.9
const GARMENT_WIDTH = GARMENT_HEIGHT * 2 / 3

interface RackMotion {
  rotation: number
  velocity: number
  target: number | null
  pointerId: number | null
  startX: number
  startY: number
  lastX: number
  lastTime: number
  dragged: boolean
  interacted: boolean
  hovering: boolean
  suppressClickUntil: number
  reportedIndex: number
}

function MetalHanger({ halfWidth, shoulderY }: { halfWidth: number; shoulderY: number }) {
  const shape = useMemo(() => {
    const shoulders = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.17, 0),
      new THREE.Vector3(-halfWidth * 0.4, -0.17 + (shoulderY + 0.17) * 0.4, 0),
      new THREE.Vector3(-halfWidth, shoulderY, 0),
      new THREE.Vector3(-halfWidth + 0.02, shoulderY - 0.035, 0),
      new THREE.Vector3(halfWidth - 0.02, shoulderY - 0.035, 0),
      new THREE.Vector3(halfWidth, shoulderY, 0),
      new THREE.Vector3(halfWidth * 0.4, -0.17 + (shoulderY + 0.17) * 0.4, 0),
      new THREE.Vector3(0, -0.17, 0),
    ], false, 'centripetal')
    const hook = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.17, 0),
      new THREE.Vector3(0, -0.09, 0),
      new THREE.Vector3(0.055, -0.04, 0),
      new THREE.Vector3(0.066, 0.025, 0),
      new THREE.Vector3(0.012, 0.075, 0),
      new THREE.Vector3(-0.052, 0.055, 0),
      new THREE.Vector3(-0.063, 0.012, 0),
    ])
    return { shoulders, hook }
  }, [halfWidth, shoulderY])

  return (
    <group>
      <mesh>
        <tubeGeometry args={[shape.shoulders, 48, 0.014, 6, false]} />
        <meshStandardMaterial color="#bda987" metalness={0.62} roughness={0.27} />
      </mesh>
      <mesh>
        <tubeGeometry args={[shape.hook, 24, 0.014, 6, false]} />
        <meshStandardMaterial color="#c9b792" metalness={0.65} roughness={0.24} />
      </mesh>
    </group>
  )
}

function Garment({ product, index, total, motionRef, onOpenProduct }: {
  product: Product
  index: number
  total: number
  motionRef: React.RefObject<RackMotion>
  onOpenProduct: (product: Product) => void
}) {
  const angle = index / total * TAU
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const sourceTexture = useTexture(product.transparentGarmentImage)
  const texture = useMemo(() => {
    const copy = sourceTexture.clone()
    copy.colorSpace = THREE.SRGBColorSpace
    copy.anisotropy = 4
    copy.needsUpdate = true
    return copy
  }, [sourceTexture])
  const alphaMask = useMemo(() => {
    const image = texture.image as HTMLImageElement
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = Math.round(256 * image.height / image.width)
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return null
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data
    let top = canvas.height
    let left = canvas.width
    let right = 0
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (data[(y * canvas.width + x) * 4 + 3] > 96) {
          top = Math.min(top, y)
          if (y < top + canvas.height * 0.035) {
            left = Math.min(left, x)
            right = Math.max(right, x)
          }
        }
      }
      if (y > top + canvas.height * 0.035) break
    }
    return {
      data, width: canvas.width, height: canvas.height,
      hangerWidth: THREE.MathUtils.clamp((right - left) / canvas.width * GARMENT_WIDTH / 2, 0.27, 0.6),
      shoulderY: Math.min(-0.27, -0.13 - top / canvas.height * GARMENT_HEIGHT),
    }
  }, [texture])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(() => {
    if (!group.current || !material.current) return
    const worldAngle = angle + motionRef.current.rotation
    // Front-facing cutouts remain readable as they travel around the rail.
    group.current.rotation.y = -motionRef.current.rotation - Math.sin(worldAngle) * 0.16
    material.current.opacity = THREE.MathUtils.lerp(0.72, 1, (Math.cos(worldAngle) + 1) / 2)
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (motionRef.current.dragged || performance.now() < motionRef.current.suppressClickUntil) return
    if (event.uv && alphaMask) {
      const x = Math.min(alphaMask.width - 1, Math.floor(event.uv.x * alphaMask.width))
      const y = Math.min(alphaMask.height - 1, Math.floor((1 - event.uv.y) * alphaMask.height))
      if (alphaMask.data[(y * alphaMask.width + x) * 4 + 3] < 24) return
    }
    event.stopPropagation()
    motionRef.current.velocity = 0
    motionRef.current.interacted = true
    onOpenProduct(product)
  }

  return (
    <group ref={group} position={[Math.sin(angle) * RACK_RADIUS, RAIL_HEIGHT, Math.cos(angle) * RACK_RADIUS]}>
      <MetalHanger halfWidth={alphaMask?.hangerWidth ?? 0.48} shoulderY={alphaMask?.shoulderY ?? -0.35} />
      <mesh position={[0, -GARMENT_HEIGHT / 2 - 0.13, 0.016]} onClick={handleClick}>
        <planeGeometry args={[GARMENT_WIDTH, GARMENT_HEIGHT]} />
        <meshBasicMaterial
          ref={material}
          map={texture}
          transparent
          alphaTest={0.04}
          depthWrite
          side={THREE.DoubleSide}
          blending={THREE.NormalBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Scene({ products, activeIndex, onActiveChange, onOpenProduct, isVisible, motionRef, reducedMotion }: ClothingRackProps & {
  motionRef: React.RefObject<RackMotion>
  reducedMotion: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const { invalidate, camera } = useThree()

  useEffect(() => {
    camera.lookAt(0, 0.55, 0)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, invalidate])

  useEffect(() => {
    const state = motionRef.current
    if (activeIndex !== state.reportedIndex && products.length) {
      const desired = -activeIndex / products.length * TAU
      const shortest = THREE.MathUtils.euclideanModulo(desired - state.rotation + Math.PI, TAU) - Math.PI
      state.target = state.rotation + shortest
      state.velocity = 0
      state.interacted = true
      state.reportedIndex = activeIndex
    }
    invalidate()
  }, [activeIndex, products.length, motionRef, invalidate])

  useEffect(() => { invalidate() }, [isVisible, reducedMotion, invalidate])

  useFrame((_, elapsed) => {
    if (!group.current || !isVisible || !products.length) return
    const delta = Math.min(elapsed, 0.05)
    const state = motionRef.current
    let moving = state.pointerId !== null

    if (state.pointerId === null) {
      if (state.target !== null) {
        state.rotation = reducedMotion ? state.target : THREE.MathUtils.damp(state.rotation, state.target, 9, delta)
        if (Math.abs(state.rotation - state.target) < 0.0004) {
          state.rotation = state.target
          state.target = null
        }
        moving = true
      } else if (Math.abs(state.velocity) > 0.008 && !reducedMotion) {
        state.rotation += state.velocity * delta
        state.velocity *= Math.exp(-4.8 * delta)
        moving = true
      } else if (!state.interacted && !state.hovering && !reducedMotion) {
        state.rotation += 0.045 * delta
        moving = true
      }
    }

    group.current.rotation.y = state.rotation
    if (state.target === null) {
      const index = THREE.MathUtils.euclideanModulo(Math.round(-state.rotation / TAU * products.length), products.length)
      if (index !== state.reportedIndex) {
        state.reportedIndex = index
        onActiveChange(index)
      }
    }
    if (moving) invalidate()
  })

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[-4, 7, 6]} intensity={3.2} color="#fff7eb" />
      <directionalLight position={[5, 4, -3]} intensity={2} color="#ffffff" />
      <group ref={group}>
        <mesh position={[0, RAIL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RACK_RADIUS, 0.033, 10, 120]} />
          <meshStandardMaterial color="#cbbd9f" metalness={0.68} roughness={0.24} />
        </mesh>
        {products.map((product, index) => (
          <Suspense key={product.id} fallback={null}>
            <Garment product={product} index={index} total={products.length} motionRef={motionRef} onOpenProduct={onOpenProduct} />
          </Suspense>
        ))}
      </group>
      <ContactShadows position={[0, -1.08, 0]} opacity={0.16} blur={3} scale={13} far={6} frames={1} resolution={256} />
    </>
  )
}

export default function ClothingRack({ products, activeIndex, onActiveChange, onOpenProduct, isVisible = true }: ClothingRackProps) {
  const reducedMotion = useReducedMotion()
  const invalidateRef = useRef<() => void>(() => {})
  const motion = useRef<RackMotion>({
    rotation: -activeIndex / Math.max(1, products.length) * TAU,
    velocity: 0, target: null, pointerId: null,
    startX: 0, startY: 0, lastX: 0, lastTime: 0,
    dragged: false, interacted: false, hovering: false,
    suppressClickUntil: 0, reportedIndex: activeIndex,
  })

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    const state = motion.current
    state.pointerId = event.pointerId
    state.startX = state.lastX = event.clientX
    state.startY = event.clientY
    state.lastTime = performance.now()
    state.dragged = false
    state.velocity = 0
    state.target = null
    state.interacted = true
    invalidateRef.current()
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = motion.current
    if (state.pointerId !== event.pointerId) return
    const dx = event.clientX - state.startX
    if (!state.dragged) {
      if (Math.abs(dx) < 6) return
      if (event.pointerType === 'touch' && Math.abs(event.clientY - state.startY) > Math.abs(dx)) return
      state.dragged = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const now = performance.now()
    const amount = (event.clientX - state.lastX) * 0.0055
    const elapsed = Math.max(8, now - state.lastTime) / 1000
    state.rotation += amount
    state.velocity = THREE.MathUtils.clamp(amount / elapsed, -2.6, 2.6)
    state.lastX = event.clientX
    state.lastTime = now
    event.preventDefault()
    invalidateRef.current()
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = motion.current
    if (state.pointerId !== event.pointerId) return
    if (state.dragged) state.suppressClickUntil = performance.now() + 350
    if (performance.now() - state.lastTime > 100 || event.type === 'pointercancel') state.velocity = 0
    state.pointerId = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    invalidateRef.current()
  }

  return (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerEnter={() => { motion.current.hovering = true }}
      onPointerLeave={() => { motion.current.hovering = false; invalidateRef.current() }}
      onDragStart={(event) => event.preventDefault()}
      aria-label="Forgatható ruhatartó. Húzd oldalra, vagy válassz egy ruhát."
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 3.1, 12.8], fov: 37 }}
        onCreated={({ invalidate }) => { invalidateRef.current = invalidate }}
        fallback={<ClothingRackFallback products={products} activeIndex={activeIndex} onActiveChange={onActiveChange} onOpenProduct={onOpenProduct} isVisible={isVisible} />}
      >
        <Scene products={products} activeIndex={activeIndex} onActiveChange={onActiveChange} onOpenProduct={onOpenProduct} isVisible={isVisible} motionRef={motion} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
