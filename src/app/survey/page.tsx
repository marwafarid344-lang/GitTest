"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { ArrowLeft, ChevronLeft, Globe, Sparkles } from "lucide-react"
import Image from "next/image"

/* ═══════════════════════════════════════════════════════════════════════════════
   Survey Intro — /survey
   Immersive creative intro with animated mesh, floating orbs, typing effects
   Arabic text — with language selection (RTL)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Typing effect hook ──────────────────────────────────────────────────── */
function useTyping(text: string, speed = 45, delay = 600) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed(""); setDone(false)
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])
  return { displayed, done }
}

/* ── Floating orb component ──────────────────────────────────────────────── */
function FloatingOrb({ size, color, x, y, duration, blur }: {
  size: number; color: string; x: string; y: string; duration: number; blur: number
}) {
  return (
    <div
      className="orb-float pointer-events-none fixed rounded-full"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        left: x, top: y,
        filter: `blur(${blur}px)`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

/* ── Step data ───────────────────────────────────────────────────────────── */
const STEPS = [
  { 
    id: "hero", 
    title: "الذكاء الاصطناعي بيكتب…\nبس هل بيحس؟", 
    subtitle: "استبيان بحثي بسيط نكتشف بيه الفرق بين التعبير الإنساني والاصطناعي." 
  },
  { 
    id: "why", 
    title: "بــالنســبالنا\nرأيك مـ💭ـهم جدًا ", 
    subtitle: "هتشوف نصوص مختلفة وتحاول تميّز: مين كتب ده؟ إنسان ولا AI؟" 
  },
  { 
    id: "details", 
    title: "٢٢ سؤال.\n٥ دقايق.\nبمنتـهى السهولة. ", 
    subtitle: "٤ مواضيع مختلفة. إجاباتك الصريحة هتفرق معانا جدًا." 
  },
  { 
    id: "privacy", 
    title: "خصوصيتــ🔒ـك\nمحفوظة. ", 
    subtitle: "مفيش بيانات شخصية بتتسجل، وكل الإجابات مجهولة تمامًا." 
  },
  { 
    id: "lang", 
    title: "", 
    subtitle: "" 
  },
]

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function SurveyIntro() {
  const [step, setStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 30)
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [mouseX, mouseY])

  const current = STEPS[step]
  const { displayed: typedTitle, done: titleDone } = useTyping(current.title, 35, 200)
  const { displayed: typedSub } = useTyping(current.subtitle, 18, current.title.length * 35 + 500)

  const isLast = step === STEPS.length - 1

  const goTo = (i: number) => { if (i >= 0 && i < STEPS.length) setStep(i) }

  if (!mounted) return null

  return (
    <div ref={containerRef} dir="rtl" lang="ar" className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden" style={{ background: "#070710" }}>

      {/* ── Animated mesh background ── */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="mesh-gradient" />
      </div>

      {/* ── Noise texture overlay ── */}
      <div className="fixed inset-0 -z-10 opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* ── Floating orbs ── */}
      <FloatingOrb size={400} color="rgba(124,58,237,0.12)" x="-5%" y="10%" duration={18} blur={80} />
      <FloatingOrb size={300} color="rgba(219,39,119,0.1)" x="75%" y="60%" duration={22} blur={60} />
      <FloatingOrb size={250} color="rgba(124,58,237,0.08)" x="60%" y="-10%" duration={15} blur={90} />
      <FloatingOrb size={180} color="rgba(219,39,119,0.06)" x="20%" y="70%" duration={20} blur={50} />

      {/* ── Chameleon watermark ── */}
      <motion.div className="fixed top-5 left-6 z-50" style={{ x: springX, y: springY }}>
        <div className="flex items-center gap-1.5">
          <Image src="/images/1212-removebg-preview.png" alt="Chameleon" width={16} height={16} className="object-contain opacity-30" />
          <span className="text-white/20 text-[10px] font-bold tracking-wider">Chameleon</span>
        </div>
      </motion.div>

      {/* ── Progress ring ── */}
      <div className="fixed top-6 right-6 z-50">
        <svg width="36" height="36" viewBox="0 0 36 36" className="rotate-[-90deg]">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          <motion.circle
            cx="18" cy="18" r="15" fill="none"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 15}
            initial={false}
            animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - (step + 1) / STEPS.length) }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/25">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      {/* ═════════ Content ═════════ */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12">
        <AnimatePresence mode="wait">

          {/* ── Text slides (0–3) ── */}
          {!isLast && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start min-h-[60vh] justify-center"
            >
              {/* Title with typing effect */}
              <h1
                className="font-bold tracking-tight leading-[1.0] text-white mb-6 relative"
                style={{ fontSize: "clamp(2.8rem, 8vw, 7.5rem)" }}
              >
                {typedTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
                {!titleDone && (
                  <span className="inline-block w-[3px] h-[0.85em] bg-violet-500 mr-1 animate-pulse rounded-full align-baseline" />
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-white/40 text-lg sm:text-xl max-w-2xl leading-loose min-h-[3em]">
                {typedSub}
              </p>

              {/* Decorative accent line */}
              <motion.div
                className="mt-10 h-[2px] rounded-full"
                style={{ background: "linear-gradient(to left, #7c3aed, #db2777, transparent)" }}
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
              />
            </motion.div>
          )}

          {/* ── Language selection (last slide) ── */}
          {isLast && (
            <motion.div
              key="lang"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center min-h-[70vh] text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 150 }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="size-20 rounded-3xl bg-violet-500/10 backdrop-blur-sm flex items-center justify-center border border-violet-500/20 rotate-12">
                    <Globe className="size-10 text-violet-400 -rotate-12" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 size-5 text-pink-400 animate-pulse" />
                </div>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                اختار لغتك
              </h2>
              <p className="text-white/25 text-sm mb-12">نفس الاستبيان، باللغة اللي تريحك</p>

              <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-md">
                {/* Arabic */}
                <Link href="/survey/ar" className="group relative flex-1 w-full">
                  <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-500 group-hover:border-violet-500/30 group-hover:shadow-2xl group-hover:shadow-violet-500/10 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="text-4xl font-bold text-violet-400 mb-2 group-hover:scale-110 transition-transform duration-300">ع</div>
                      <h3 className="text-xl font-bold tracking-tight text-white mb-1">عربي</h3>
                      <p className="text-white/25 text-xs">المصرية العامية</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right rounded-b-3xl" />
                  </div>
                </Link>

                {/* Divider */}
                <div className="hidden sm:flex flex-col items-center gap-2 text-white/10">
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">or</span>
                  <div className="w-px h-8 bg-white/[0.06]" />
                </div>
                <div className="sm:hidden flex items-center gap-3 text-white/10 w-full max-w-[200px]">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">أو</span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                {/* English */}
                <Link href="/survey/en" className="group relative flex-1 w-full">
                  <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-500 group-hover:border-pink-500/30 group-hover:shadow-2xl group-hover:shadow-pink-500/10 group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Globe className="size-9 text-pink-400 inline" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-white mb-1">English</h3>
                      <p className="text-white/25 text-xs">English Version</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl" />
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      {!isLast && (
        <div className="fixed bottom-8 inset-x-0 z-40 flex items-center justify-center gap-3">
          {step > 0 && (
            <button
              onClick={() => goTo(step - 1)}
              className="w-12 h-12 rounded-full backdrop-blur-sm bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/15 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
          )}
          <motion.button
            onClick={() => goTo(step + 1)}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="h-12 px-8 rounded-full font-bold text-base text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", boxShadow: "0 8px 30px rgba(124,58,237,0.3)" }}
          >
            <span className="flex items-center gap-2">
              التالي <ChevronLeft className="w-4 h-4" />
            </span>
          </motion.button>
        </div>
      )}

      {/* Skip */}
      {!isLast && (
        <button
          onClick={() => goTo(STEPS.length - 1)}
          className="fixed bottom-8 right-6 z-40 text-white/15 hover:text-white/35 text-[11px] transition-colors duration-300 font-medium"
        >
          تخطي ←
        </button>
      )}

      {/* Back on lang slide */}
      {isLast && (
        <button
          onClick={() => goTo(step - 1)}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 text-white/20 hover:text-white/45 text-xs transition-colors duration-300 flex items-center gap-1.5"
        >
          رجوع <ArrowLeft className="w-3 h-3 rotate-180" />
        </button>
      )}

      {/* ── Styles ── */}
      <style>{`
        .mesh-gradient {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(219,39,119,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(124,58,237,0.04) 0%, transparent 50%);
          animation: meshMove 25s ease-in-out infinite alternate;
        }
        @keyframes meshMove {
          0% { transform: translate(0%, 0%) rotate(0deg) }
          33% { transform: translate(-3%, 2%) rotate(1deg) }
          66% { transform: translate(2%, -2%) rotate(-1deg) }
          100% { transform: translate(-1%, 1%) rotate(0.5deg) }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1) }
          25% { transform: translate(20px, -30px) scale(1.05) }
          50% { transform: translate(-15px, 15px) scale(0.95) }
          75% { transform: translate(25px, 10px) scale(1.02) }
        }
        .orb-float {
          animation: orbFloat var(--duration, 18s) ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}
