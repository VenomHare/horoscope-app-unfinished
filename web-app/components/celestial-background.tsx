"use client"

import { useEffect, useRef } from "react"

export default function CelestialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const paint = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#F7EFE1"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 900; i++) {
        const opacity = Math.random() * 0.09
        ctx.fillStyle = `rgba(42, 33, 25, ${opacity})`
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
      }
    }

    paint()

    const handleResize = () => paint()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-80" />
}
