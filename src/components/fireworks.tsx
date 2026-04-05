"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Fireworks() {
  const [bursts, setBursts] = useState<{ id: number; cx: number; cy: number }[]>([]);

  useEffect(() => {
    // Fire the first burst immediately
    setBursts([{ id: Date.now(), cx: 50, cy: 30 }]);

    // Generate more bursts over a few seconds
    const interval = setInterval(() => {
      setBursts(prev => [...prev, {
        id: Date.now() + Math.random(),
        cx: Math.random() * 80 + 10, // 10% to 90%
        cy: Math.random() * 50 + 10,
      }]);
    }, 600);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {bursts.map(b => (
          <Burst key={b.id} cx={b.cx} cy={b.cy} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Burst({ cx, cy }: { cx: number; cy: number }) {
  const colors = ["#f97316", "#ec4899", "#a855f7", "#10b981", "#3b82f6", "#eab308", "#22d3ee"];
  
  // Create 30 particles per burst
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = Math.random() * 120 + 80;
    return {
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4
    };
  });

  return (
    <motion.div
      className="absolute"
      style={{ left: `${cx}%`, top: `${cy}%` }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut", delay: 1 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{ x: p.x, y: p.y + 60, scale: [0, 1.2, 0.5] }}
          transition={{ duration: 1.5 + Math.random() * 0.5, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}
