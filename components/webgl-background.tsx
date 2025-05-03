"use client"

import { useRef, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface WebGLBackgroundProps {
  color1?: string
  color2?: string
  noiseIntensity?: number
  noiseSpeed?: number
  displacementIntensity?: number
  displacementSpeed?: number
  interactive?: boolean
  className?: string
}

export function WebGLBackground({
  color1 = "#1a1a2e",
  color2 = "#16213e",
  noiseIntensity = 0.15,
  noiseSpeed = 0.2,
  displacementIntensity = 0.3,
  displacementSpeed = 0.1,
  interactive = true,
  className = "",
}: WebGLBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const pathname = usePathname()
  const shaderProgramRef = useRef<WebGLProgram | null>(null)
  const animationFrameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now())
  const resolutionUniformLocationRef = useRef<WebGLUniformLocation | null>(null)
  const timeUniformLocationRef = useRef<WebGLUniformLocation | null>(null)
  const mouseUniformLocationRef = useRef<WebGLUniformLocation | null>(null)
  const color1UniformLocationRef = useRef<WebGLUniformLocation | null>(null)
  const color2UniformLocationRef = useRef<WebGLUniformLocation | null>(null)
  const noiseIntensityUniformLocationRef = useRef<WebGLUniformLocation | null>(null)
  const displacementIntensityUniformLocationRef = useRef<WebGLUniformLocation | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `

    // Fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform float u_noiseIntensity;
      uniform float u_displacementIntensity;
      
      varying vec2 v_texCoord;
      
      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;
        
        // Apply displacement based on mouse position
        float mouseDistance = distance(uv, mouse);
        float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance);
        
        // Create noise displacement
        float noise1 = snoise(uv * 3.0 + u_time * 0.1) * u_noiseIntensity;
        float noise2 = snoise(uv * 6.0 - u_time * 0.2) * u_noiseIntensity * 0.5;
        
        // Apply displacement
        vec2 displacedUV = uv;
        displacedUV += vec2(noise1, noise2) * u_displacementIntensity;
        
        // Add mouse interaction
        if (mouseInfluence > 0.0) {
          vec2 dir = normalize(uv - mouse);
          displacedUV += dir * mouseInfluence * 0.1;
        }
        
        // Create gradient
        float gradientNoise = snoise(displacedUV * 2.0 + u_time * 0.05) * 0.1;
        float gradient = length(displacedUV - 0.5) * 2.0 + gradientNoise;
        gradient = smoothstep(0.0, 1.0, gradient);
        
        // Mix colors
        vec3 color = mix(u_color1, u_color2, gradient);
        
        // Add subtle noise to color
        color += vec3(noise1, noise2, noise1) * 0.05;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    if (!vertexShader || !fragmentShader) return

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    // Check for shader compile errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader compilation error:", gl.getShaderInfoLog(vertexShader))
      return
    }

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader compilation error:", gl.getShaderInfoLog(fragmentShader))
      return
    }

    // Create shader program
    const shaderProgram = gl.createProgram()
    if (!shaderProgram) return

    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    // Check for linking errors
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Shader program linking error:", gl.getProgramInfoLog(shaderProgram))
      return
    }

    shaderProgramRef.current = shaderProgram

    // Create a buffer for the vertices
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // Create a square that covers the entire canvas
    const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    // Get attribute and uniform locations
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position")
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution")
    const timeUniformLocation = gl.getUniformLocation(shaderProgram, "u_time")
    const mouseUniformLocation = gl.getUniformLocation(shaderProgram, "u_mouse")
    const color1UniformLocation = gl.getUniformLocation(shaderProgram, "u_color1")
    const color2UniformLocation = gl.getUniformLocation(shaderProgram, "u_color2")
    const noiseIntensityUniformLocation = gl.getUniformLocation(shaderProgram, "u_noiseIntensity")
    const displacementIntensityUniformLocation = gl.getUniformLocation(shaderProgram, "u_displacementIntensity")

    resolutionUniformLocationRef.current = resolutionUniformLocation
    timeUniformLocationRef.current = timeUniformLocation
    mouseUniformLocationRef.current = mouseUniformLocation
    color1UniformLocationRef.current = color1UniformLocation
    color2UniformLocationRef.current = color2UniformLocation
    noiseIntensityUniformLocationRef.current = noiseIntensityUniformLocation
    displacementIntensityUniformLocationRef.current = displacementIntensityUniformLocation

    // Helper function to convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255
      return [r, g, b]
    }

    // Animation loop
    const render = () => {
      const time = ((Date.now() - startTimeRef.current) / 1000) * noiseSpeed

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Use the shader program
      if (shaderProgramRef.current) {
        gl.useProgram(shaderProgramRef.current)
      }

      // Set uniforms
      if (resolutionUniformLocationRef.current) {
        gl.uniform2f(resolutionUniformLocationRef.current, canvas.width, canvas.height)
      }
      if (timeUniformLocationRef.current) {
        gl.uniform1f(timeUniformLocationRef.current, time)
      }
      if (mouseUniformLocationRef.current) {
        gl.uniform2f(mouseUniformLocationRef.current, mousePosition.x, canvas.height - mousePosition.y)
      }
      if (color1UniformLocationRef.current) {
        gl.uniform3fv(color1UniformLocationRef.current, hexToRgb(color1))
      }
      if (color2UniformLocationRef.current) {
        gl.uniform3fv(color2UniformLocationRef.current, hexToRgb(color2))
      }
      if (noiseIntensityUniformLocationRef.current) {
        gl.uniform1f(noiseIntensityUniformLocationRef.current, noiseIntensity)
      }
      if (displacementIntensityUniformLocationRef.current) {
        gl.uniform1f(displacementIntensityUniformLocationRef.current, displacementIntensity * displacementSpeed)
      }

      // Set up position attribute
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (interactive) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener("resize", setCanvasDimensions)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [color1, color2, noiseIntensity, noiseSpeed, displacementIntensity, displacementSpeed, interactive, pathname])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
