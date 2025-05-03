"use client"

import type React from "react"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Text,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  MeshReflectorMaterial,
  Sphere,
  Box,
  Torus,
  RoundedBox,
  Stars,
  Cloud,
  Html,
} from "@react-three/drei"
import { motion } from "framer-motion-3d"
import { Vector3 } from "three"

interface Scene3DProps {
  className?: string
  cameraPosition?: [number, number, number]
  background?: string
  environment?: string
  preset?: "studio" | "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "city" | "park" | "lobby"
  controls?: boolean
  autoRotate?: boolean
  children?: React.ReactNode
  interactive?: boolean
  shadows?: boolean
  height?: string
  width?: string
}

export function Scene3D({
  className = "",
  cameraPosition = [0, 0, 5],
  background = "transparent",
  environment = "studio",
  preset = "studio",
  controls = true,
  autoRotate = false,
  children,
  interactive = true,
  shadows = true,
  height = "100vh",
  width = "100%",
}: Scene3DProps) {
  return (
    <div className={className} style={{ height, width }}>
      <Canvas shadows={shadows} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={[background]} />
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[10, 10, 10]} intensity={1} shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={<Loader />}>
          <Environment preset={preset} background={false} />
          {children}
        </Suspense>
        {controls && <OrbitControls autoRotate={autoRotate} enableZoom={interactive} enablePan={interactive} />}
      </Canvas>
    </div>
  )
}

// Loader component
function Loader() {
  const { viewport } = useThree()
  const [rotation, setRotation] = useState(0)

  useFrame(() => {
    setRotation((prev) => prev + 0.01)
  })

  return (
    <mesh rotation={[0, rotation, 0]} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.5, 0.2, 128, 32]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  )
}

// Export individual components for easy use
export function FloatingBox({
  position = [0, 0, 0],
  color = "#8b5cf6",
  size = 1,
  rotation = [0, 0, 0],
  speed = 1,
  distort = 0.3,
  wobble = 0,
  metalness = 0.2,
  roughness = 0.25,
  envMapIntensity = 1,
  rounded = false,
  children,
}: {
  position?: [number, number, number]
  color?: string
  size?: number
  rotation?: [number, number, number]
  speed?: number
  distort?: number
  wobble?: number
  metalness?: number
  roughness?: number
  envMapIntensity?: number
  rounded?: boolean
  children?: React.ReactNode
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1

    // Gentle rotation
    meshRef.current.rotation.x = rotation[0] + state.clock.elapsedTime * 0.1 * speed
    meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.15 * speed
  })

  const BoxComponent = rounded ? RoundedBox : Box

  return (
    <motion.group
      position={position}
      animate={{ scale: hovered ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <BoxComponent
        ref={meshRef}
        args={[size, size, size]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {distort > 0 ? (
          <MeshDistortMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
            distort={distort}
          />
        ) : wobble > 0 ? (
          <MeshWobbleMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
            factor={wobble}
            speed={speed}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
          />
        )}
      </BoxComponent>
      {children}
    </motion.group>
  )
}

export function FloatingSphere({
  position = [0, 0, 0],
  color = "#3b82f6",
  radius = 1,
  speed = 1,
  distort = 0.3,
  wobble = 0,
  metalness = 0.2,
  roughness = 0.25,
  envMapIntensity = 1,
  children,
}: {
  position?: [number, number, number]
  color?: string
  radius?: number
  speed?: number
  distort?: number
  wobble?: number
  metalness?: number
  roughness?: number
  envMapIntensity?: number
  children?: React.ReactNode
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1

    // Gentle rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed
  })

  return (
    <motion.group
      position={position}
      animate={{ scale: hovered ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Sphere
        ref={meshRef}
        args={[radius, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {distort > 0 ? (
          <MeshDistortMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
            distort={distort}
          />
        ) : wobble > 0 ? (
          <MeshWobbleMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
            factor={wobble}
            speed={speed}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
          />
        )}
      </Sphere>
      {children}
    </motion.group>
  )
}

export function FloatingTorus({
  position = [0, 0, 0],
  color = "#ec4899",
  radius = 1,
  tubeRadius = 0.4,
  speed = 1,
  distort = 0.3,
  wobble = 0,
  metalness = 0.2,
  roughness = 0.25,
  envMapIntensity = 1,
  children,
}: {
  position?: [number, number, number]
  color?: string
  radius?: number
  tubeRadius?: number
  speed?: number
  distort?: number
  wobble?: number
  metalness?: number
  roughness?: number
  envMapIntensity?: number
  children?: React.ReactNode
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1

    // Gentle rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed
  })

  return (
    <motion.group
      position={position}
      animate={{ scale: hovered ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Torus
        ref={meshRef}
        args={[radius, tubeRadius, 32, 100]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {distort > 0 ? (
          <MeshDistortMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
            distort={distort}
          />
        ) : wobble > 0 ? (
          <MeshWobbleMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
            factor={wobble}
            speed={speed}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            envMapIntensity={envMapIntensity}
            metalness={metalness}
            roughness={roughness}
          />
        )}
      </Torus>
      {children}
    </motion.group>
  )
}

export function FloatingText({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  text = "Virtual Labs",
  color = "#ffffff",
  fontSize = 1,
  font = "/fonts/Inter_Bold.json",
  maxWidth = 10,
  lineHeight = 1,
  letterSpacing = 0,
  textAlign = "center",
  anchorX = "center",
  anchorY = "middle",
  speed = 1,
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  text?: string
  color?: string
  fontSize?: number
  font?: string
  maxWidth?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: "left" | "center" | "right"
  anchorX?: "left" | "center" | "right"
  anchorY?: "top" | "middle" | "bottom"
  speed?: number
  children?: React.ReactNode
}) {
  const textRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!textRef.current) return

    // Gentle floating animation
    textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1
  })

  return (
    <motion.group
      position={position}
      rotation={rotation}
      animate={{ scale: hovered ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          ref={textRef}
          font={font}
          fontSize={fontSize}
          color={color}
          maxWidth={maxWidth}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          textAlign={textAlign}
          anchorX={anchorX}
          anchorY={anchorY}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {text}
        </Text>
      </Float>
      {children}
    </motion.group>
  )
}

export function FloatingModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  path = "/assets/3d/duck.glb",
  speed = 1,
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  path?: string
  speed?: number
  children?: React.ReactNode
}) {
  const modelRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(path)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!modelRef.current) return

    // Gentle floating animation
    modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1

    // Gentle rotation
    modelRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2 * speed
  })

  return (
    <motion.group
      position={position}
      rotation={rotation}
      scale={scale}
      animate={{
        scale: hovered
          ? typeof scale === "number"
            ? scale * 1.1
            : new Vector3(scale[0] * 1.1, scale[1] * 1.1, scale[2] * 1.1)
          : scale,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <primitive
        ref={modelRef}
        object={scene.clone()}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      />
      {children}
    </motion.group>
  )
}

export function Floor({
  position = [0, -1, 0],
  rotation = [-Math.PI / 2, 0, 0],
  width = 30,
  height = 30,
  color = "#111111",
  metalness = 0.2,
  roughness = 0.8,
  mirror = 0.5,
  blur = 10,
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  color?: string
  metalness?: number
  roughness?: number
  mirror?: number
  blur?: number
  children?: React.ReactNode
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <MeshReflectorMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        mirror={mirror}
        blur={[blur, blur]}
        resolution={1024}
        mixBlur={1}
        mixStrength={10}
        depthScale={1}
        minDepthThreshold={0.8}
        maxDepthThreshold={1}
        depthToBlurRatioBias={0.5}
      />
      {children}
    </mesh>
  )
}

export function StarsBackground({
  radius = 100,
  depth = 50,
  count = 5000,
  factor = 4,
  saturation = 0,
  fade = true,
  speed = 1,
}: {
  radius?: number
  depth?: number
  count?: number
  factor?: number
  saturation?: number
  fade?: boolean
  speed?: number
}) {
  return (
    <Stars
      radius={radius}
      depth={depth}
      count={count}
      factor={factor}
      saturation={saturation}
      fade={fade}
      speed={speed}
    />
  )
}

export function CloudsGroup({
  count = 5,
  position = [0, 0, 0],
  color = "#ffffff",
  opacity = 0.5,
  speed = 0.5,
  width = 10,
  depth = 1.5,
  segments = 20,
}: {
  count?: number
  position?: [number, number, number]
  color?: string
  opacity?: number
  speed?: number
  width?: number
  depth?: number
  segments?: number
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return

    group.current.rotation.y = state.clock.elapsedTime * 0.05 * speed
  })

  return (
    <group ref={group} position={position}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const radius = 5 + Math.random() * 5
        const cloudPosition: [number, number, number] = [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius,
        ]

        return (
          <Cloud
            key={i}
            position={cloudPosition}
            opacity={opacity}
            speed={speed}
            width={width}
            depth={depth}
            segments={segments}
            color={color}
          />
        )
      })}
    </group>
  )
}

export function HtmlContent({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  transform = true,
  occlude = true,
  children,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  transform?: boolean
  occlude?: boolean | "blending" | "raycast"
  children?: React.ReactNode
}) {
  return (
    <Html
      position={position}
      rotation={rotation}
      transform={transform}
      occlude={occlude}
      className="pointer-events-auto"
      distanceFactor={10}
    >
      {children}
    </Html>
  )
}
