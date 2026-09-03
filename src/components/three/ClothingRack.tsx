'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { Product } from '@/types'

interface ClothingRackProps {
  products: Product[]
  activeIndex: number
  onActiveChange: (index: number) => void
  isVisible?: boolean
}

const RACK_RADIUS = 2.8
const RING_HEIGHT = 2.5
const ITEM_HEIGHT = 1.0

interface GarmentProps {
  product: Product
  index: number
  total: number
  activeDiff: number
}

const Garment = ({ product, index, total, activeDiff }: GarmentProps) => {
  const angle = (index / total) * Math.PI * 2
  const x = Math.sin(angle) * RACK_RADIUS
  const z = Math.cos(angle) * RACK_RADIUS
  
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  const texture = useMemo(() => {
    try {
      if (product.transparentGarmentImage) {
        return new THREE.TextureLoader().load(product.transparentGarmentImage, undefined, undefined, () => {
          console.warn('Failed to load texture', product.transparentGarmentImage)
        })
      }
    } catch (e) {}
    return null
  }, [product.transparentGarmentImage])

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return
    
    let targetScale = 1.0
    let targetOpacity = 1.0
    
    if (activeDiff === 0) {
      targetScale = 1.0
      targetOpacity = 1.0
    } else if (activeDiff === 1) {
      targetScale = 0.85
      targetOpacity = 0.8
    } else if (activeDiff === 2) {
      targetScale = 0.7
      targetOpacity = 0.55
    } else {
      targetScale = 0.6
      targetOpacity = 0.35
    }

    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1)
    
    meshRef.current.lookAt(new THREE.Vector3(x * 2, ITEM_HEIGHT, z * 2))
  })

  return (
    <group position={[x, ITEM_HEIGHT, z]}>
      {/* Hanger wire — thin cylinder */}
      <mesh position={[0, (RING_HEIGHT - ITEM_HEIGHT + 0.9) / 2, 0]}>
        <cylinderGeometry args={[0.005, 0.005, RING_HEIGHT - ITEM_HEIGHT - 0.9, 4]} />
        <meshStandardMaterial color="#B8A98F" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh ref={meshRef}>
        <planeGeometry args={[1.2, 1.8]} />
        <meshStandardMaterial 
          ref={materialRef}
          transparent={true}
          side={THREE.DoubleSide}
          color={texture ? '#ffffff' : (product.colorHex || '#d8d3cb')}
          map={texture}
        />
      </mesh>
    </group>
  )
}

function Scene({ products, activeIndex, onActiveChange }: ClothingRackProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { invalidate } = useThree()
  
  const [isDragging, setIsDragging] = useState(false)
  const [rotationVelocity, setRotationVelocity] = useState(0)
  const [lastX, setLastX] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null)
  const [startX, setStartX] = useState(0)
  const [dragThresholdMet, setDragThresholdMet] = useState(false)

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    setStartX(clientX)
    setLastX(clientX)
    setIsDragging(true)
    setDragThresholdMet(false)
    setAutoRotate(false)
    if (inactivityTimer) clearTimeout(inactivityTimer)
  }

  const handlePointerMove = (e: any) => {
    if (!isDragging) return
    e.stopPropagation()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    
    if (!dragThresholdMet) {
      if (Math.abs(clientX - startX) > 5) {
        setDragThresholdMet(true)
      } else {
        return
      }
    }

    const deltaX = clientX - lastX
    setRotationVelocity(deltaX * 0.005)
    setLastX(clientX)
    invalidate()
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    const timer = setTimeout(() => setAutoRotate(true), 3000)
    setInactivityTimer(timer)
  }

  useFrame(() => {
    if (!groupRef.current) return
    
    let needsInvalidate = false

    if (isDragging) {
      groupRef.current.rotation.y += rotationVelocity
      needsInvalidate = true
    } else {
      if (Math.abs(rotationVelocity) > 0.0001) {
        groupRef.current.rotation.y += rotationVelocity
        setRotationVelocity((v) => v * 0.95)
        needsInvalidate = true
      } else if (autoRotate) {
        groupRef.current.rotation.y += 0.002
        needsInvalidate = true
      }
    }

    if (needsInvalidate) invalidate()

    const totalItems = products.length
    if (totalItems > 0) {
      let currentRot = groupRef.current.rotation.y % (Math.PI * 2)
      if (currentRot < 0) currentRot += Math.PI * 2
      
      const segmentAngle = (Math.PI * 2) / totalItems
      const newActiveIndex = (totalItems - Math.round(currentRot / segmentAngle)) % totalItems
      
      if (newActiveIndex !== activeIndex) {
         onActiveChange(newActiveIndex)
      }
    }
  })

  // Optionally snap rotation when activeIndex is changed externally
  useEffect(() => {
    if (groupRef.current && !isDragging && Math.abs(rotationVelocity) < 0.001 && products.length > 0) {
      const segmentAngle = (Math.PI * 2) / products.length
      const targetRotation = -activeIndex * segmentAngle
      // For smoother control we could lerp this, but for external next/prev buttons it's fine.
    }
  }, [activeIndex, isDragging, rotationVelocity, products.length])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      <mesh 
        position={[0, ITEM_HEIGHT, 0]} 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        visible={false}
      >
        <cylinderGeometry args={[RACK_RADIUS + 1.5, RACK_RADIUS + 1.5, 6, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <group ref={groupRef}>
        <mesh position={[0, RING_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.04, 16, 100]} />
          <meshStandardMaterial color="#B8A98F" metalness={0.8} roughness={0.2} />
        </mesh>

        {products.map((product, index) => {
           const total = products.length
           let diff = Math.abs(index - activeIndex)
           if (diff > total / 2) diff = total - diff
           
           return (
             <Garment 
               key={product.id} 
               product={product} 
               index={index} 
               total={total}
               activeDiff={diff}
             />
           )
        })}
      </group>
      
      <ContactShadows position={[0, -0.5, 0]} opacity={0.15} blur={2.5} />
    </>
  )
}

export default function ClothingRack({ products, activeIndex, onActiveChange, isVisible = true }: ClothingRackProps) {
  if (!isVisible) return null

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        frameloop="demand" 
        dpr={[1, 1.5]}
        camera={{ position: [0, 2, 8], fov: 45 }}
      >
        <Scene 
          products={products} 
          activeIndex={activeIndex} 
          onActiveChange={onActiveChange} 
          isVisible={isVisible}
        />
      </Canvas>
    </div>
  )
}
