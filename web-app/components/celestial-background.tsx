"use client"

import { useEffect, useRef } from "react"

export default function CelestialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Array<{ x: number; y: number; radius: number; opacity: number; twinkleSpeed: number }> = []

    // Generate stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      })
    }

    let animationFrameId: number
    let time = 0

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and animate stars
      stars.forEach((star) => {
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed
        star.opacity = Math.max(0.2, Math.min(1, star.opacity))

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw floating orbs
      for (let i = 0; i < 3; i++) {
        const x = Math.sin(time * 0.0003 + i) * 200 + canvas.width / 2
        const y = Math.cos(time * 0.0002 + i) * 150 + canvas.height / 2

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 80)
        gradient.addColorStop(0, "rgba(168, 85, 247, 0.3)")
        gradient.addColorStop(1, "rgba(168, 85, 247, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(x - 80, y - 80, 160, 160)
      }

      time++
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
}
