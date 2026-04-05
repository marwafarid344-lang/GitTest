"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export default function ChallengeEnergy() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex flex-col items-center justify-center -z-0">
      {/* ── BACKGROUND GLOW — Pulse (Subtle) ── */}
      <motion.div
        className="absolute w-[60vmax] h-[60vmax] bg-rose-600/5 blur-[120px] rounded-full"
        animate={{
          scale: [1, 1.3, 1.1],
          opacity: [0.05, 0.2, 0.1],
        }}
        transition={{ duration: 2.6, times: [0, 0.8, 1], ease: "easeInOut" }}
        style={{ scale: 1, willChange: "transform, opacity" }}
      />

      {/* ── PHASE 2: RAPID JINGLE - CLEAR DENSITY SPARKS ── */}
      <div className="absolute inset-0 overflow-visible">
        {[...Array(45)].map((_, i) => (
          <motion.div
            key={`bolt-${i}`}
            className="absolute text-orange-400"
            initial={{
              left: Math.random() > 0.5 ? "-20%" : "120%",
              top: `${Math.random() * 120 - 10}%`,
              scale: 0,
              rotate: Math.random() * 360,
            }}
            animate={{
              left: "50%",
              top: "50%",
              scale: [0, 1.4, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 0.55,
              delay: 0.6 + Math.random() * 1.4,
              ease: "circIn",
            }}
            style={{ x: "-50%", y: "-50%", willChange: "transform, opacity" }}
          >
            <Zap className="size-7 fill-current drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
          </motion.div>
        ))}
      </div>

      {/* ── PHASE 2: RAPID JINGLE - ENERGY METER ── */}
      <motion.div 
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-72 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 shadow-[0_0_20px_rgba(244,63,94,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <motion.span 
          className="text-[10px] font-black tracking-[0.3em] uppercase text-orange-400/60"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.4, repeat: 4, delay: 0.8 }}
        >
          Charging Energy
        </motion.span>
      </motion.div>

      {/* ── PHASE 3: FINAL CHIME - SLIGHT BURST ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center overflow-visible z-50"
        animate={{
          x: [0, -8, 8, -4, 4, 0],
          y: [0, 4, -4, 2, -2, 0],
        }}
        transition={{ duration: 0.25, delay: 2.1 }}
      >
        {/* Subtle Poof */}
        <motion.div
          className="size-4 rounded-full bg-white shadow-[0_0_100px_30px_#fff]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 600, 750],
            opacity: [0, 0.5, 0],
          }}
          transition={{ duration: 0.6, delay: 2.1, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
        />
        
        {/* Slight Cinematic Ring Burst */}
        <motion.div
          className="absolute border-[4px] border-white/40 rounded-full"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: [0, 3000],
            height: [0, 3000],
            opacity: [0, 0.4, 0],
          }}
          transition={{ duration: 0.7, delay: 2.1, ease: "easeOut" }}
          style={{ willChange: "transform, opacity" }}
        />
      </motion.div>
    </div>
  )
}
