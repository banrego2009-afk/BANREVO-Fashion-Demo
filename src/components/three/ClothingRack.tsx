'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
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
  onClick: () => void
}

const Garment = ({ product, index, total, activeDiff, onClick }: GarmentProps) => {
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
      targetScale = 0.9
      targetOpacity = 0.85
    } else if (activeDiff === 2) {
      targetScale = 0.75
      targetOpacity = 0.65
    } else {
      targetScale = 0.65
      targetOpacity = 0.45
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
        <meshStandardMaterial color="#B8A98F" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh ref={meshRef} onClick={onClick}>
        <planeGeometry args={[1.5, 2.25]} />
        <meshStandardMaterial 
          ref={materialRef}
          transparent={true}
          alphaTest={0.05}
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
  
  const stateRef = useRef({
    isDragging: false,
    rotationVelocity: 0,
    lastX: 0,
    autoRotate: true,
    startX: 0,
    dragThresholdMet: false
  })

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    stateRef.current.startX = clientX
    stateRef.current.lastX = clientX
    stateRef.current.isDragging = true
    stateRef.current.dragThresholdMet = false
    stateRef.current.autoRotate = false
  }

  const handlePointerMove = (e: any) => {
    if (!stateRef.current.isDragging) return
    e.stopPropagation()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    
    if (!stateRef.current.dragThresholdMet) {
      if (Math.abs(clientX - stateRef.current.startX) > 5) {
        stateRef.current.dragThresholdMet = true
      } else {
        return
      }
    }

    const deltaX = clientX - stateRef.current.lastX
    stateRef.current.rotationVelocity = deltaX * 0.005
    stateRef.current.lastX = clientX
    invalidate()
  }

  const handlePointerUp = () => {
    stateRef.current.isDragging = false
    setTimeout(() => {
      stateRef.current.autoRotate = true
    }, 3000)
  }

  useFrame(() => {
    if (!groupRef.current) return
    
    let needsInvalidate = false
    const s = stateRef.current

    if (s.isDragging) {
      groupRef.current.rotation.y += s.rotationVelocity
      needsInvalidate = true
    } else {
      if (Math.abs(s.rotationVelocity) > 0.0001) {
        groupRef.current.rotation.y += s.rotationVelocity
        s.rotationVelocity *= 0.95
        needsInvalidate = true
      } else if (s.autoRotate) {
        groupRef.current.rotation.y += 0.002
        needsInvalidate = true
      }
    }

    if (needsInvalidate) invalidate()

    const totalItems = products.length
    if (totalItems > 0 && Math.abs(s.rotationVelocity) > 0.001) {
      let currentRot = groupRef.current.rotation.y % (Math.PI * 2)
      if (currentRot < 0) currentRot += Math.PI * 2
      
      const segmentAngle = (Math.PI * 2) / totalItems
      const newActiveIndex = (totalItems - Math.round(currentRot / segmentAngle)) % totalItems
      
      if (newActiveIndex !== activeIndex) {
         onActiveChange(newActiveIndex)
      }
    }
  })

  // Optionally snap rotation when activeIndex is changed externally (e.g. arrows)
  useEffect(() => {
    if (groupRef.current && !stateRef.current.isDragging && Math.abs(stateRef.current.rotationVelocity) < 0.001 && products.length > 0) {
      const segmentAngle = (Math.PI * 2) / products.length
      const targetRotation = -activeIndex * segmentAngle
      groupRef.current.rotation.y = targetRotation
      invalidate()
    }
  }, [activeIndex, products.length, invalidate])

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <Environment preset="city" />
      
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
          <torusGeometry args={[3, 0.03, 32, 100]} />
          <meshStandardMaterial color="#D4C5A9" metalness={1.0} roughness={0.1} />
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
               onClick={() => onActiveChange(index)}
             />
           )
        })}
      </group>
      
      <ContactShadows position={[0, -0.5, 0]} opacity={0.3} blur={3.0} />
    </>
  )
}

export default function ClothingRack({ products, activeIndex, onActiveChange, isVisible = true }: ClothingRackProps) {
  if (!isVisible) return null

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing touch-none">
      <Canvas 
        frameloop="demand" 
        dpr={[1, 1.5]}
        camera={{ position: [0, 2, 8.5], fov: 45 }}
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
