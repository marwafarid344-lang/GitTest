"use client"

import { useEffect } from "react"
import gsap from "gsap"

/**
 * Staggered fade-up reveal for elements with [data-fade-up] inside container.
 * GPU-composited: transform + opacity only. Clears will-change after entrance.
 */
export function useStaggerReveal(
  containerRef: React.RefObject<HTMLElement | null>,
  delay = 0.3
) {
  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const els = containerRef.current!.querySelectorAll("[data-fade-up]")
      if (!els.length) return
      gsap.set(els, { y: 32, opacity: 0, willChange: "transform, opacity" })
      gsap.to(els, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
        delay,
        onComplete() {
          gsap.set(els, { willChange: "auto", clearProps: "willChange" })
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [containerRef, delay])
}

/**
 * Infinite floating for elements with [data-blob].
 * Each blob gets unique duration/offset for organic movement.
 * Perf: 2 tweens per blob (y + x combined feel), force3D, longer durations.
 */
export function useFloatingBlobs(
  containerRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const blobs = containerRef.current!.querySelectorAll("[data-blob]")
      blobs.forEach((blob, i) => {
        const dur = 8 + i * 2           // slower = fewer GPU frames
        const yAmp = 18 + i * 6
        const xAmp = 12 + i * 5

        // Y float
        gsap.to(blob, { y: yAmp, duration: dur, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.6, force3D: true })
        // X drift
        gsap.to(blob, { x: xAmp, duration: dur * 1.3, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.4, force3D: true })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [containerRef])
}

/**
 * Subtle mouse-following parallax using gsap.quickTo (60fps).
 */
export function useMouseParallax(
  targetRef: React.RefObject<HTMLElement | null>,
  intensity = 6
) {
  useEffect(() => {
    const el = targetRef.current
    if (!el) return
    // Skip on touch/low-end devices
    if (window.matchMedia("(pointer: coarse)").matches) return
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return

    const xTo = gsap.quickTo(el, "x", { duration: 1.2, ease: "power2.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 1.2, ease: "power2.out" })

    let ticking = false
    const onMove = (e: MouseEvent) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const xP = (e.clientX / window.innerWidth - 0.5) * 2
        const yP = (e.clientY / window.innerHeight - 0.5) * 2
        xTo(xP * intensity)
        yTo(yP * (intensity * 0.6))
        ticking = false
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [targetRef, intensity])
}
