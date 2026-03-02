"use client"

import { useRef } from "react"
import { useFloatingBlobs } from "@/hooks/use-gsap-survey-intro"

/**
 * Premium cinematic background — layered composition:
 *  1. Deep dark base
 *  2. Animated aurora gradient sweep
 *  3. Floating gradient blobs (GSAP) — 3 blobs, lower blur
 *  4. Radial spotlight
 *  5. Noise texture
 *  6. Vignette
 *
 * Performance: reduced blob count, lower blur radius, transform-only GSAP, CSS-only aurora.
 */
export default function SurveyIntroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  useFloatingBlobs(containerRef)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 1 ─ Deep base */}
      <div className="absolute inset-0 bg-[#060a14]" />

      {/* 2 ─ Aurora sweep (CSS animation) */}
      <div className="absolute inset-0 opacity-[0.3] survey-aurora" />

      {/* 3 ─ Floating gradient blobs (reduced to 3, lower blur) */}
      <div
        data-blob
        className="absolute -top-40 -right-40 w-[500px] h-[500px] md:w-[650px] md:h-[650px] rounded-full opacity-[0.28]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0) 70%)",
          filter: "blur(60px)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
      <div
        data-blob
        className="absolute top-[30%] -left-32 w-[400px] h-[400px] md:w-[520px] md:h-[520px] rounded-full opacity-[0.22]"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)",
          filter: "blur(60px)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
      <div
        data-blob
        className="absolute -bottom-28 left-[20%] w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full opacity-[0.18]"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(168,85,247,0) 70%)",
          filter: "blur(65px)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />

      {/* 4 ─ Radial spotlight in center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(139,92,246,0.06) 0%, transparent 70%)",
        }}
      />

      {/* 5 ─ Noise */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 6 ─ Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 30%, rgba(6,10,20,0.65) 100%)",
        }}
      />
    </div>
  )
}
