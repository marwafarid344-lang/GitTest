"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMemo } from "react"
import openai from "@thesvg/icons/openai"
import grammarly from "@thesvg/icons/grammarly"
import notion from "@thesvg/icons/notion"
import gemini from "@thesvg/icons/google-gemini"
import copilot from "@thesvg/icons/microsoft-copilot"
import claude from "@thesvg/icons/claude"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function HeroGeometric({
  badge = "Chameleon FCDS",
  title1 = "Master Your",
  title2 = "Future Skills",
}: {
  badge?: string
  title1?: string
  title2?: string
}) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUpVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }), []);

  const animationSettings = prefersReducedMotion ? { animate: "visible" } : { initial: "hidden", animate: "visible" };

  const AI_TOOLS = [
    { name: "ChatGPT", svgStr: openai.variants.default },
    { name: "Grammarly", svgStr: grammarly.variants.default },
    { name: "Notion AI", svgStr: notion.variants.default },
    { name: "Google Gemini", svgStr: gemini.variants.default },
    { name: "Microsoft Copilot", svgStr: copilot.variants.default },
    { name: "Anthropic Claude", svgStr: claude.variants.default },
  ];

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]"
      style={{
        backgroundImage: 'url("/images/main.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'
      }} />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Image 
              src="/images/1212-removebg-preview.png" 
              alt="Kokonut UI" 
              width={20} 
              height={20}
              priority
              loading="eager"
              unoptimized={true}
            />
            <span className="text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          {/* ══════════ AI VS HUMAN Survey Banner ══════════ */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mb-8"
          >
            <Link href="/survey" className="group block relative w-full max-w-[320px] md:max-w-[420px] mx-auto mt-0 md:mt-2">
              
              {/* Randomly Scattered Icons */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {AI_TOOLS.map((tool, i) => {
                  // Scattered, random-looking coordinates around the banner box
                  const positions = [
                    { left: "-15%", top: "-110%" },     // Top left
                    { left: "105%", top: "-80%" },      // Top right
                    { left: "-10%", top: "150%" },      // Bottom left
                    { left: "105%", top: "130%" },      // Bottom right
                    { left: "40%", top: "-140%" },      // Top middle
                    { left: "60%", top: "170%" },       // Bottom middle
                  ];
                  const pos = positions[i % positions.length];
                  
                  return (
                    <motion.div
                      key={tool.name}
                      className="absolute"
                      style={{ left: pos.left, top: pos.top }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15, duration: 0.7, type: "spring" }}
                    >
                      <motion.div
                        animate={prefersReducedMotion ? {} : { 
                          y: [0, -8, 0, 8, 0],
                          x: [0, 4, 0, -4, 0],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          duration: 4 + (i % 3), 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: i * 0.3
                        }}
                      >
                        <div className="bg-white/10 backdrop-blur-md p-1.5 md:p-2 rounded-xl border border-white/10 shadow-lg flex items-center justify-center">
                          <div 
                            className="w-5 h-5 md:w-7 md:h-7 object-contain drop-shadow-md hover:scale-110 transition-transform flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: tool.svgStr }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Banner Container */}
              <div className="relative z-10 mx-auto flex flex-row items-center justify-center gap-3 py-2 px-4 md:py-2.5 md:px-5 rounded-full border border-white/[0.08] hover:border-white/[0.15] transition-all bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md w-fit shadow-lg">
                <div className="flex items-center gap-1.5 hidden sm:flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-300">New Survey</span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500 tracking-wider">AI</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-white/40">VS</span>
                  <span className={cn("text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-rose-400 to-amber-400", pacifico.className)}>Human</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-white/70 text-[10px] md:text-xs pl-3 border-l border-white/10 group-hover:text-white transition-colors">
                  Take Survey
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

            </Link>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} {...animationSettings} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}>
            <h1 className="text-[65px] md:text-[120px] font-bold mb-6 md:mb-8 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif',fontWeight:'bold'}}>
              <span className="text-white">
                {title1}
              </span>
              <br />
              <span className={cn(
                "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                pacifico.className,
              )}>
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} {...animationSettings} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}>
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Transforming ideas into vibrant digital experiences, adapting seamlessly like a chameleon to every challenge and vision.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}
