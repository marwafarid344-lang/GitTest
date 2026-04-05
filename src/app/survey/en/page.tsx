"use client"

import { useState, useCallback, memo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Send, Loader2, Gift, Check, Sparkles, ArrowLeft, Share2, Facebook, MessageCircle, BarChart3, BrainCircuit } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import Image from "next/image"
import { useToast } from "@/components/ToastProvider"
import { Fireworks } from "@/components/fireworks"
import ChallengeEnergy from "@/components/ChallengeEnergy"

import {
  type Question,
  ALL_STEPS_EN as ALL_STEPS,
  TOTAL,
  FORM_MAP,
  FORM_BASE,
  DEMO_COUNT
} from "./../questions"

type AnswerVal = string | string[] | number

/* ── Pill — glassmorphism with animated check ─────────────────────────────── */
const Pill = memo(function Pill({ label, selected, accent, onClick, iconUrl }: {
  label: string; selected: boolean; accent: string; onClick: () => void; iconUrl?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="relative px-5 py-3.5 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 outline-none text-left overflow-hidden backdrop-blur-sm"
      style={{
        border: `1.5px solid ${selected ? accent : "rgba(255,255,255,0.08)"}`,
        background: selected ? `${accent}12` : "rgba(255,255,255,0.03)",
        color: selected ? "#fff" : "rgba(255,255,255,0.5)",
        boxShadow: selected ? `0 4px 20px ${accent}25, inset 0 1px 0 ${accent}15` : "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {selected && (
        <motion.div
          layoutId="pill-glow"
          className="absolute inset-0 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}05)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {selected && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-flex items-center justify-center size-4 rounded-full"
            style={{ background: accent }}
          >
            <Check className="size-2.5 text-white" strokeWidth={3} />
          </motion.span>
        )}
        {iconUrl && (
          <img src={iconUrl} alt="" className="size-5 object-contain" style={{ filter: selected ? "none" : "grayscale(0.5) opacity(0.7)" }} />
        )}
        {label}
      </span>
    </motion.button>
  )
})

/* ── Rating scale — creative with connecting track ────────────────────────── */
const RatingScale = memo(function RatingScale({ value, onChange, minLabel, maxLabel, accent, accent2 }: {
  value: number | null; onChange: (v: number) => void
  minLabel: string; maxLabel: string; accent: string; accent2: string
}) {
  return (
    <div>
      <div className="relative flex gap-2 sm:gap-3 mt-2">
        <div className="absolute top-1/2 left-4 right-4 h-[2px] -translate-y-1/2 bg-white/[0.06] rounded-full" />
        {value && value > 1 && (
          <motion.div
            className="absolute top-1/2 left-4 h-[2px] -translate-y-1/2 rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }}
            initial={false}
            animate={{ width: `${((value - 1) / 4) * (100 - 8)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = value === n
          const isFilled = value !== null && n <= value
          return (
            <motion.button
              key={n}
              onClick={() => onChange(n)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="relative z-10 flex-1 h-14 md:h-16 rounded-2xl font-bold text-lg md:text-xl transition-all duration-200"
              style={
                isSelected
                  ? { background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff", boxShadow: `0 8px 30px ${accent}40` }
                  : isFilled
                    ? { background: `${accent}20`, border: `2px solid ${accent}40`, color: "#fff" }
                    : { background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }
              }
            >
              {n}
              {isSelected && (
                <motion.div
                  layoutId="rating-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full"
                  style={{ background: accent2 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      <div className="flex justify-between mt-3 text-[11px] text-white/25 font-medium uppercase tracking-wider">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
})

/* ── Progress bar — creative glowing ──────────────────────────────────────── */
const ProgressBar = memo(function ProgressBar({ step, accent, accent2 }: { step: number; accent: string; accent2: string }) {
  const pct = (step / TOTAL) * 100
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/[0.03] z-50">
      <motion.div
        className="h-full relative"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ background: `linear-gradient(90deg,${accent},${accent2})`, willChange: "width" }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-white shadow-lg" style={{ boxShadow: `0 0 10px ${accent}` }} />
      </motion.div>
      <div className="absolute top-3 right-4 text-[10px] text-white/20 font-bold tabular-nums">{step} / {TOTAL}</div>
    </div>
  )
})

// ─── Transition presets (GPU-only: opacity + transform) ───────────────────────
const SLIDE   = { initial: { opacity: 0, x: 70 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -70 } }
const FADE_UP = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } }
const DUR     = { duration: 0.36, ease: [0.16, 1, 0.3, 1] } as const

// ─── Main ─────────────────────────────────────────────────────────────────────

const getChartDataEN = (answers: Record<string, any>) => {
  const q8 = Number(answers["q8"]) || 3; 
  const trustScore = answers["q2"] === "AI writing" ? 5 : answers["q2"] === "Both equally" ? 3 : 1;
  const toolCount = Array.isArray(answers["q15"]) && !answers["q15"].includes("I do not use AI tools") ? Math.min(answers["q15"].length, 5) : 1;
  const emotionScore = answers["q6"] === "Yes, to a great extent" ? 5 : answers["q6"] === "Yes, to a moderate extent" ? 3 : 1;

  return [
    { name: "Creativity", score: q8 * 20, color: "#f97316" },
    { name: "AI Trust", score: trustScore * 20, color: "#10b981" },
    { name: "Tools Usage", score: toolCount * 20, color: "#3b82f6" },
    { name: "Emotion", score: emotionScore * 20, color: "#a855f7" },
  ];
};

const getRadarDataEN = (answers: Record<string, any>) => {
  const q3 = answers["q3"] || [];
  const speed = Array.isArray(q3) && q3.includes("Speed in completing tasks") ? 95 : 45;
  const effort = Array.isArray(q3) && q3.includes("Saving effort") ? 90 : 50;
  const emotion = answers["q10"] && Array.isArray(answers["q10"]) && answers["q10"].includes("Emotional expression") ? 85 : 30;
  const style = Array.isArray(q3) && q3.includes("Language formulation/style") ? 85 : 40;
  const generation = Array.isArray(q3) && q3.includes("Helps generate ideas") ? 95 : 55;

  return [
    { subject: 'Speed', A: speed, fullMark: 100 },
    { subject: 'Efficiency', A: effort, fullMark: 100 },
    { subject: 'Empathy', A: emotion, fullMark: 100 },
    { subject: 'Style', A: style, fullMark: 100 },
    { subject: 'Ideation', A: generation, fullMark: 100 },
  ];
};

const getAIAnalysisEN = (answers: Record<string, any>, personaTitle: string) => {
  const trustAI = answers["q2"] === "AI writing" || answers["q2"] === "Both equally";
  const editOften = answers["q9"] === "Always" || answers["q9"] === "Often";

  let analysis = `Based on a multi-dimensional analysis of your interactive choices, our metrics strongly align your cognitive framework with the **${personaTitle}** archetype. `;
  
  if (trustAI && editOften) {
    analysis += "You exhibit a high baseline trust in algorithmic generation, yet you maintain a meticulous eye for detail—ensuring your human oversight ultimately polishes the final output.";
  } else if (trustAI && !editOften) {
    analysis += "You heavily rely on AI-generated content in its pure form, fully embracing machine efficiency and speed within your primary workflow.";
  } else if (!trustAI && editOften) {
    analysis += "You remain highly analytical and skeptical of generative outputs, treating AI merely as a raw drafting tool that necessitates heavy human intervention.";
  } else {
    analysis += "You maintain a balanced, pragmatic distance from generative tools, typically favoring biological creativity over algorithmic precision.";
  }

  return analysis;
};

const getPersonaEN = (answers: Record<string, AnswerVal>) => {
  const q1 = answers["q1"] as string;
  const q2 = answers["q2"] as string;
  const q4 = answers["q4"] as string;
  const q15 = answers["q15"] as string[];

  const isPositive = q1 === "I like it very much" || q1 === "I somewhat like it";
  const trustsAI = q2 === "AI writing" || q2 === "Both equally";
  const usesTools = q15 && q15.length > 0 && !q15.includes("I do not use AI tools");

  if (isPositive && trustsAI && usesTools) {
    return {
      title: "The AI Pioneer",
      desc: "You're living in the future! 85% likely to let AI write your next text message.",
      color: "#10b981",
    };
  } else if (!isPositive && !trustsAI && (q4 === "It cannot be relied upon" || q4 === "Only in formal writing")) {
    return {
      title: "The Skeptic",
      desc: "You trust a pen and paper far more than any algorithm.",
      color: "#ef4444",
    };
  } else if (!isPositive && !trustsAI) {
    return {
      title: "The Humanist",
      desc: "100% purely human! You can spot a robot's writing from a mile away.",
      color: "#8b5cf6",
    };
  } else {
    return {
      title: "The Pragmatist",
      desc: "Efficiency is your middle name. AI is your assistant, not your replacement.",
      color: "#3b82f6",
    };
  }
};

export default function SurveyPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [step, setStep] = useState(0) // 0=intro, 1..TOTAL=questions, TOTAL+1=done
  const [answers, setAnswers] = useState<Record<string, AnswerVal>>({})
  const [otherText, setOtherText] = useState("") // for "Other" option in radio-other
  const [submitting, setSubmitting] = useState(false)
  const [showChallenge, setShowChallenge] = useState(false)
  const { addToast } = useToast()

  // Hydration & Local Storage Load
  useEffect(() => {
    setIsMounted(true)
    try {
      const savedStep = localStorage.getItem("chameleon-step-en")
      const savedAnswers = localStorage.getItem("chameleon-answers-en")
      const savedOther = localStorage.getItem("chameleon-other-en")
      if (savedStep) setStep(parseInt(savedStep, 10))
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
      if (savedOther) setOtherText(savedOther)
    } catch(e) {}
  }, [])

  // Sync to Local Storage
  useEffect(() => {
    if (!isMounted) return;
    if (step > 0 && step <= TOTAL) {
      localStorage.setItem("chameleon-step-en", step.toString())
      localStorage.setItem("chameleon-answers-en", JSON.stringify(answers))
      localStorage.setItem("chameleon-other-en", otherText)
    } else if (step > TOTAL) {
      localStorage.removeItem("chameleon-step-en")
      localStorage.removeItem("chameleon-answers-en")
      localStorage.removeItem("chameleon-other-en")
    }
  }, [step, answers, otherText, isMounted])

  const q: Question | null = step >= 1 && step <= TOTAL ? ALL_STEPS[step - 1] : null
  const answer = q ? answers[q.id] : undefined

  useEffect(() => {
    if (q?.id === "text-a-read") {
      setShowChallenge(true)
    } else {
      setShowChallenge(false)
    }
  }, [step, q?.id])

  // For text-compare, check all sub-questions are answered
  const canProceed = !q
    || (q.type === "radio"       && typeof answer === "string" && answer.length > 0)
    || (q.type === "radio-other" && typeof answer === "string" && answer.length > 0 && (answer !== "Other" || otherText.trim().length > 0))
    || (q.type === "checkbox"    && Array.isArray(answer) && (answer as string[]).length > 0)
    || (q.type === "checkbox-other" && Array.isArray(answer) && (answer as string[]).length > 0 && (!(answer as string[]).includes("Other") || otherText.trim().length > 0))
    || (q.type === "textarea"    && !q.required)
    || (q.type === "textarea"    && q.required && typeof answer === "string" && (answer as string).trim().length >= 5)
    || (q.type === "text-input"  && !q.required) // phone is optional — always can proceed
    || (q.type === "text-input"  && q.required && typeof answer === "string" && (answer as string).trim().length > 0)
    || (q.type === "rating"      && typeof answer === "number")
    || (q.type === "text-compare" && q.subQuestions != null && q.subQuestions.every(sq => {
         const sqAnswer = answers[sq.id]
         return typeof sqAnswer === "string" && sqAnswer.length > 0
       }))
    || (q.type === "text-display")

  const audioObj = useRef<HTMLAudioElement | null>(null)
  const audioEndObj = useRef<HTMLAudioElement | null>(null)
  const audioChallengeObj = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioObj.current = new Audio("/audio/duolingo-correct.mp3")
      audioObj.current.volume = 0.4
      audioObj.current.load()

      audioEndObj.current = new Audio("/audio/duolingo-lesson-complete-results.mp3")
      audioEndObj.current.volume = 0.6
      audioEndObj.current.load()

      audioChallengeObj.current = new Audio("/audio/duolingo-rajoute-de-energie.mp3")
      audioChallengeObj.current.volume = 0.5
      audioChallengeObj.current.load()
    }
  }, [])

  const prevCanProceed = useRef(canProceed)
  useEffect(() => {
    if (canProceed && !prevCanProceed.current && step >= 1 && step <= TOTAL) {
      if (audioObj.current) {
        audioObj.current.currentTime = 0
        const playPromise = audioObj.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      }
    }
    prevCanProceed.current = canProceed
  }, [canProceed, step])

  useEffect(() => {
    if (step === TOTAL + 1 && audioEndObj.current) {
      audioEndObj.current.currentTime = 0
      const playPromise = audioEndObj.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    }
  }, [step])

  useEffect(() => {
    if (showChallenge && audioChallengeObj.current) {
      audioChallengeObj.current.currentTime = 0
      const playPromise = audioChallengeObj.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    }
  }, [showChallenge])
  const setAnswer = useCallback((val: AnswerVal) => {
    if (!q) return
    setAnswers((prev) => ({ ...prev, [q.id]: val }))
  }, [q])

  const setSubAnswer = useCallback((subId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [subId]: val }))
  }, [])

  const handleNext = useCallback(async () => {
    // Conditional logic: skip demo-field if High School is selected
    if (q?.id === "demo-education" && answers["demo-education"] === "High School") {
      setAnswers((prev) => ({ ...prev, "demo-field": "Not specialized" })) // Pre-fill to bypass optional/required limits
      setStep((s) => s + 2) // Skip demo-field
      return
    }

    if (step < TOTAL) { setStep((s) => s + 1); return }
    setSubmitting(true)
    try {
      const params = new URLSearchParams()
      for (const [qId, entryId] of Object.entries(FORM_MAP)) {
        const val = answers[qId]
        if (val === undefined || val === null || val === "") continue
        if (Array.isArray(val)) {
          for (const v of val) {
            // checkbox-other: replace "Other" with otherText
            const sendVal = (v === "Other" && otherText.trim()) ? otherText.trim() : v
            params.append(entryId, sendVal)
          }
        } else if (typeof val === "number") {
          params.append(entryId, String(val))
        } else {
          // radio-other: if "Other" selected, send the custom text
          let finalVal = val as string
          if (qId === "demo-field" && val === "Other" && otherText.trim()) finalVal = otherText.trim()
          else if (qId === "demo-field" && val === "Not specialized") finalVal = "" // Send empty if High School

          params.append(entryId, finalVal)
        }
      }
      // Submit via the new API proxy
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })

      if (!res.ok) throw new Error("Submission failed")

      addToast("✅ Response sent! Your answers have been recorded successfully.", "success")
    } catch {
      addToast("⚠️ Submission issue. Your answers may not have been recorded. Please try again.", "error")
    }
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setStep(TOTAL + 1)
  }, [step, answers, otherText, addToast])

  const handleBack = useCallback(() => {
    // If we are on the step right AFTER the skipped demo-field (which is q1),
    // and High School was selected, jump back 2 steps instead of 1.
    const q1Index = ALL_STEPS.findIndex(s => s.id === "q1") + 1 // +1 because step 0 is intro
    if (step === q1Index && answers["demo-education"] === "High School") {
      setStep((s) => Math.max(s - 2, 0))
    } else {
      setStep((s) => Math.max(s - 1, 0))
    }
  }, [step, answers])

  const accent  = q?.accent  ?? "#7c3aed"
  const accent2 = q?.accent2 ?? "#db2777"

  // Step counter display — show demographic step or survey question number
  const stepDisplay = q
    ? q.section === "Tell Us About You"
      ? { label: q.section, counter: `${step} / ${DEMO_COUNT}` }
      : { label: q.section, counter: `${step - DEMO_COUNT} / ${TOTAL - DEMO_COUNT}` }
    : null

  const personaInfo = step === TOTAL + 1 ? getPersonaEN(answers) : null;
  const shareText = personaInfo ? `I just took the Chameleon Survey and my persona is '${personaInfo.title}'! Find out yours here:` : "";
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + "/survey" : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Chameleon Survey", text: shareText, url: shareUrl });
      } catch (err) { }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      addToast("Link copied to clipboard!", "success");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-outfit" style={{ background: "#070710" }}>

      {/* CSS blob animations — zero JS, compositor-only */}
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[120px] opacity-25 survey-blob-1"
        style={{ width: 600, height: 600, background: `radial-gradient(circle,${accent},transparent 70%)`, top: "-15%", right: "-8%", willChange: "transform" }} />
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[100px] opacity-15 survey-blob-2"
        style={{ width: 500, height: 500, background: `radial-gradient(circle,${accent2},transparent 70%)`, bottom: "-10%", left: "-5%", willChange: "transform" }} />

      {/* Progress strip */}
      {step >= 1 && step <= TOTAL && <ProgressBar step={step} accent={accent} accent2={accent2} />}

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-28 py-20">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── INTRO — creative ── */}
          {step === 0 && (
            <motion.div key="intro" {...FADE_UP} transition={DUR}>
              <motion.div className="flex items-center gap-2 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Image src="/images/1212-removebg-preview.png" alt="Chameleon" width={22} height={22} className="object-contain" />
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#a855f7" }}>
                  Chameleon Survey 2026
                </p>
              </motion.div>

              <motion.h1
                className="font-extrabold leading-[0.92] tracking-tight text-white mb-5"
                style={{ fontSize: "clamp(2.4rem,7vw,6.5rem)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                AI can write.{"\n"}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)", WebkitBackgroundClip: "text" }}>
                  But can it feel?
                </span>
              </motion.h1>

              <motion.p className="text-base md:text-lg text-white/40 max-w-xl mb-3 leading-relaxed font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <span className="font-semibold text-white/60">Perception Survey</span> — Exploring how people perceive AI writing versus human writing.
              </motion.p>


              <motion.div 
                className="flex items-center gap-2 mb-4 ml-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 }}
              >
                <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(88,204,2,0.2)]">
                  <span className="text-[11px] font-extrabold tracking-widest uppercase text-white/60 leading-none">Sound Effects By</span>
                  <div className="h-4 w-px bg-white/20" />
                  <Image src="/images/Duolingo.svg" alt="Duolingo" width={80} height={80} className="drop-shadow-[0_0_12px_rgba(88,204,2,0.6)]" />
                </div>
              </motion.div>

              <motion.div className="mb-8 p-5 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] flex items-center gap-4 max-w-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Gift className="w-8 h-8 text-pink-500 animate-bounce shrink-0" />
                <p className="text-sm md:text-base text-white/70 font-medium">
                  Register for exclusive prizes! 🎁
                </p>
              </motion.div>

              <motion.button
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-4 text-white font-bold text-xl md:text-2xl px-10 py-5 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", boxShadow: "0 10px 40px rgba(124,58,237,0.3)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Begin Survey <ChevronRight className="w-6 h-6" />
              </motion.button>


            </motion.div>
          )}

          {/* CHALLENGE SPLASH SCREEN */}
          {q?.id === "text-a-read" && showChallenge ? (
            <motion.div key="challenge-splash" {...FADE_UP} transition={DUR} className="relative text-center flex flex-col items-center justify-center min-h-[50vh] rounded-3xl p-10">

               <ChallengeEnergy />
               
               <motion.div 
                 initial={{ y: -300, scaleY: 1.8, opacity: 0 }} 
                 animate={{ 
                   y: [ -300, 0, -30, 0 ],
                   scaleY: [ 1.8, 0.5, 1.3, 1 ],
                   scaleX: [ 0.6, 1.6, 0.8, 1 ],
                   opacity: 1
                 }} 
                 transition={{ 
                   duration: 0.8, 
                   times: [ 0, 0.4, 0.7, 1 ],
                   ease: "circOut"
                 }} 
                 className="mb-8 relative z-10"
               >
                 <div className="size-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                   <span className="text-5xl drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">🔥</span>
                 </div>
               </motion.div>
               <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-6 drop-shadow-lg relative z-10">
                 Challenge Starts Now!
               </h2>
               <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-lg font-light leading-relaxed relative z-10">
                 Can you tell the difference between Human and AI?<br/>
                 <span className="font-semibold text-white">Let's see how sharp your eyes are.</span>
               </p>
               <button onClick={() => setShowChallenge(false)} className="relative z-10 bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                 Start Challenge
               </button>
            </motion.div>

          ) : step >= 1 && step <= TOTAL && q && (
            <motion.div key={`q${step}`} {...SLIDE} transition={DUR}>

              {/* Section header — glowing dot */}
              <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <div className="size-2 rounded-full" style={{ background: q.accent, boxShadow: `0 0 8px ${q.accent}66` }} />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: q.accent }}>{stepDisplay?.label}</span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${q.accent}30, transparent)` }} />
                <span className="text-[10px] text-white/15 font-bold tabular-nums">{stepDisplay?.counter}</span>
              </motion.div>

              {/* ── Text Display ── */}
              {q.type === "text-display" && q.textContent && (
                <>
                  <motion.div className="inline-flex items-center gap-2 mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ background: `${q.accent}10`, color: q.accent, border: `1px solid ${q.accent}25` }}>
                      {q.textLabel}
                    </span>
                  </motion.div>
                  <h2 className="font-extrabold leading-[0.92] tracking-tight text-white mb-6" style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", whiteSpace: "pre-line" }}>{q.label}</h2>
                  {q.sub && <p className="text-sm md:text-base text-white/30 mb-6 font-light">{q.sub}</p>}
                  <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] max-w-2xl relative overflow-hidden shadow-lg" style={{ borderLeft: `3px solid ${q.accent}` }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-[0.06]" style={{ background: q.accent }} />
                    <p className="text-base md:text-lg text-white/60 leading-[1.9] font-light relative z-10">{q.textContent}</p>
                  </div>
                </>
              )}

              {/* ── Text Compare ── */}
              {q.type === "text-compare" && q.subQuestions && (
                <>
                  <motion.div className="inline-flex items-center gap-2 mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ background: `${q.accent}10`, color: q.accent, border: `1px solid ${q.accent}25` }}>
                      {q.textLabel}
                    </span>
                  </motion.div>
                  <h2 className="font-extrabold leading-[0.92] tracking-tight text-white mb-8" style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", whiteSpace: "pre-line" }}>{q.label}</h2>
                  <div className="space-y-8 max-w-3xl">
                    {q.subQuestions.map((sq, idx) => {
                      const sqAnswer = answers[sq.id] as string | undefined
                      return (
                        <motion.div key={sq.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }} className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]">
                          <p className="text-sm md:text-base text-white/50 font-medium mb-4">
                            <span className="inline-flex items-center justify-center size-5 rounded-full text-[10px] font-bold mr-2" style={{ background: `${q.accent}20`, color: q.accent }}>{idx + 1}</span>
                            {sq.label}
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                            {sq.options.map((opt) => (<Pill key={opt} label={opt} selected={sqAnswer === opt} accent={q.accent} onClick={() => setSubAnswer(sq.id, opt)} />))}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* ── Standard questions ── */}
              {q.type !== "text-compare" && q.type !== "text-display" && (
                <>
                  <motion.h2 className="font-extrabold leading-[0.92] tracking-tight text-white mb-4" style={{ fontSize: "clamp(2.2rem,5.5vw,5.5rem)", whiteSpace: "pre-line" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    {q.label}
                  </motion.h2>
                  {q.sub && <motion.p className="text-sm md:text-base text-white/30 mb-10 font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>{q.sub}</motion.p>}
                  {!q.sub && <div className="mb-10" />}

                  {/* Text Input — animated underline */}
                  {q.type === "text-input" && (
                    <motion.div className="max-w-md" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div className="relative">
                        <input type={q.inputType || "text"} placeholder={q.placeholder} value={(answer as string) || ""} onChange={(e) => setAnswer(e.target.value)}
                          className="w-full bg-transparent text-white text-2xl md:text-3xl font-light placeholder-white/15 outline-none pb-4" style={{ caretColor: q.accent }} />
                        <div className="h-[2px] bg-white/[0.06] rounded-full" />
                        <motion.div className="absolute bottom-0 left-0 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${q.accent}, ${q.accent2})` }} initial={false} animate={{ width: (answer as string)?.trim() ? "100%" : "0%" }} transition={{ duration: 0.4, ease: "easeOut" }} />
                      </div>
                      {!q.required && <p className="text-[11px] text-white/20 mt-3">Optional — skip if you prefer</p>}
                    </motion.div>
                  )}

                  {/* Rating */}
                  {q.type === "rating" && (
                    <motion.div className="max-w-lg" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <RatingScale value={(answer as number) ?? null} onChange={setAnswer} minLabel={q.minLabel ?? ""} maxLabel={q.maxLabel ?? ""} accent={q.accent} accent2={q.accent2} />
                    </motion.div>
                  )}

                  {/* Radio */}
                  {q.type === "radio" && q.options && (
                    <motion.div className="flex flex-wrap gap-2.5 max-w-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                      {q.options.map((opt, i) => (
                        <motion.div key={opt} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                          <Pill label={opt} selected={answer === opt} accent={q.accent} onClick={() => setAnswer(opt)} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Radio with Other */}
                  {q.type === "radio-other" && q.options && (
                    <div className="max-w-3xl">
                      <motion.div className="flex flex-wrap gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                        {q.options.map((opt, i) => (
                          <motion.div key={opt} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                            <Pill label={opt} selected={answer === opt} accent={q.accent} onClick={() => { setAnswer(opt); if (opt !== "Other") setOtherText("") }} />
                          </motion.div>
                        ))}
                      </motion.div>
                      {answer === "Other" && (
                        <motion.div initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3 }}>
                          <div className="relative mt-5 max-w-md">
                            <input type="text" placeholder="Please specify your field…" value={otherText} onChange={(e) => setOtherText(e.target.value)} autoFocus className="w-full bg-transparent text-white text-lg font-light placeholder-white/15 outline-none pb-3" style={{ caretColor: q.accent }} />
                            <div className="h-[2px] bg-white/[0.06] rounded-full" />
                            <motion.div className="absolute bottom-0 left-0 h-[2px] rounded-full" style={{ background: q.accent }} initial={false} animate={{ width: otherText.trim() ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Checkbox */}
                  {q.type === "checkbox" && q.options && (
                    <motion.div className="flex flex-wrap gap-2.5 max-w-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                      {q.options.map((opt, i) => {
                        const checked = Array.isArray(answer) && (answer as string[]).includes(opt)
                        return (
                          <motion.div key={opt} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                            <Pill label={opt} selected={checked} accent={q.accent} onClick={() => { const prev = (answer as string[]) || []; setAnswer(checked ? prev.filter((v) => v !== opt) : [...prev, opt]) }} />
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}

                  {/* Checkbox with Other */}
                  {q.type === "checkbox-other" && q.options && (
                    <div className="max-w-3xl">
                      <motion.div className="flex flex-wrap gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                        {q.options.map((opt, i) => {
                          const checked = Array.isArray(answer) && (answer as string[]).includes(opt)
                          return (
                            <motion.div key={opt} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                              <Pill label={opt} selected={checked} accent={q.accent} iconUrl={q.optionIcons?.[opt]} onClick={() => { const prev = (answer as string[]) || []; const next = checked ? prev.filter((v) => v !== opt) : [...prev, opt]; setAnswer(next); if (opt === "Other" && checked) setOtherText("") }} />
                            </motion.div>
                          )
                        })}
                      </motion.div>
                      {Array.isArray(answer) && (answer as string[]).includes("Other") && (
                        <motion.div initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3 }}>
                          <div className="relative mt-5 max-w-md">
                            <input type="text" placeholder="Please specify…" value={otherText} onChange={(e) => setOtherText(e.target.value)} autoFocus className="w-full bg-transparent text-white text-lg font-light placeholder-white/15 outline-none pb-3" style={{ caretColor: q.accent }} />
                            <div className="h-[2px] bg-white/[0.06] rounded-full" />
                            <motion.div className="absolute bottom-0 left-0 h-[2px] rounded-full" style={{ background: q.accent }} initial={false} animate={{ width: otherText.trim() ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Textarea */}
                  {q.type === "textarea" && (
                    <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <textarea rows={5} value={(answer as string) || ""} onChange={(e) => setAnswer(e.target.value)} placeholder={q.placeholder}
                        className="w-full bg-white/[0.02] backdrop-blur-sm text-white text-lg md:text-xl font-light placeholder-white/15 resize-none outline-none rounded-2xl p-5 border border-white/[0.06] transition-all duration-300 focus:border-transparent"
                        style={{ caretColor: q.accent, boxShadow: (answer as string)?.trim() ? `0 0 0 1.5px ${q.accent}40, 0 4px 20px ${q.accent}10` : "none" }} />
                      <div className="flex items-center justify-between mt-2">
                        {q.required ? (
                          <p className="text-[11px] text-white/20">{((answer as string) || "").trim().length} chars{((answer as string) || "").trim().length < 5 && <span style={{ color: q.accent }}> · min 5</span>}</p>
                        ) : (<p className="text-[11px] text-white/15">Optional</p>)}
                        {(answer as string)?.trim() && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-1.5 rounded-full" style={{ background: q.accent }} />}
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* ── Nav — creative ── */}
              <motion.div className="flex items-center gap-4 mt-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <button onClick={handleBack} className="flex items-center gap-2 text-white/20 hover:text-white/45 transition-all duration-300 text-sm font-medium hover:-translate-x-0.5">
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>
                <motion.button
                  onClick={canProceed && !submitting ? handleNext : undefined}
                  disabled={!canProceed || submitting}
                  whileHover={canProceed && !submitting ? { scale: 1.04, y: -1 } : {}}
                  whileTap={canProceed && !submitting ? { scale: 0.97 } : {}}
                  className="flex items-center gap-3 font-bold text-base md:text-lg px-8 py-4 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed"
                  style={
                    canProceed && !submitting
                      ? { background: q.accent, color: "#fff", boxShadow: `0 8px 30px ${q.accent}30` }
                      : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }
                  }
                >
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</> : step === TOTAL ? <><Send className="w-4 h-4" /> Submit</> : <>Continue <ChevronRight className="w-4 h-4" /></>}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ── DONE — creative ── */}
          {step === TOTAL + 1 && personaInfo && (
            <motion.div key="done" {...FADE_UP} transition={DUR} className="text-center flex flex-col items-center w-full max-w-2xl mx-auto">
              <Fireworks />
              
              <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 15 }} className="relative mb-6">
                <div className="size-24 rounded-full flex items-center justify-center" style={{ background: `${personaInfo.color}15` }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }}>
                    <Sparkles className="size-12" style={{ color: personaInfo.color }} />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: personaInfo.color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                Your AI Persona
              </motion.p>
              
              <h2 className="font-extrabold leading-[0.92] tracking-tight text-white mb-4" style={{ fontSize: "clamp(2.5rem,7vw,5rem)" }}>
                {personaInfo.title}
              </h2>
              
              <p className="text-lg md:text-xl text-white/50 max-w-lg mb-12 leading-relaxed font-light">
                {personaInfo.desc}
              </p>

              {/* ── AI ANALYSIS & CHARTS ── */}
              <div className="w-full flex justify-end mb-4">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
                  <BrainCircuit className="size-4" /> Neural Analysis Complete
                </div>
              </div>

              <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 md:p-8 mb-10 backdrop-blur-sm shadow-xl text-left">
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light">
                  {/* Parsing simple bold markdown */}
                  {getAIAnalysisEN(answers, personaInfo.title).split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
                </p>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-3 mb-8 justify-center">
                    <BarChart3 className="size-5 text-white/40" />
                    <h3 className="text-sm text-white/60 font-bold tracking-widest uppercase">Trait Metrics</h3>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartDataEN(answers)} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ background: '#070710', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }} 
                          itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1500}>
                          {getChartDataEN(answers).map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-3 mb-2 justify-center">
                    <BrainCircuit className="size-5 text-white/40" />
                    <h3 className="text-sm text-white/60 font-bold tracking-widest uppercase">Mental Mapping</h3>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarDataEN(answers)}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="You" dataKey="A" stroke={personaInfo.color} fill={personaInfo.color} fillOpacity={0.3} animationDuration={2000} />
                        <Tooltip 
                          contentStyle={{ background: '#070710', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }} 
                          itemStyle={{ color: personaInfo.color, fontSize: '14px', fontWeight: 'bold' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-10 backdrop-blur-sm">
                <p className="text-sm text-white/40 mb-4 uppercase tracking-[0.15em] font-medium">Share your result</p>
                <div className="flex justify-center gap-3">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] py-3 rounded-2xl transition-colors font-semibold">
                    <Facebook className="size-5" /> <span className="hidden sm:inline">Facebook</span>
                  </a>
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-3 rounded-2xl transition-colors font-semibold">
                    <MessageCircle className="size-5" /> <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                  <button onClick={handleNativeShare} className="flex-1 flex items-center justify-center gap-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 py-3 rounded-2xl transition-colors font-semibold">
                    <Share2 className="size-5" /> <span className="hidden sm:inline">Instagram</span>
                  </button>
                </div>
              </div>

              <a href="../" className="inline-flex items-center gap-3 font-bold text-base px-8 py-4 rounded-2xl text-white/40 hover:text-white border border-white/[0.06] hover:border-white/15 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CSS blob drift — zero JS */}
      <style>{`
        @keyframes blobDrift1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-25px,18px) scale(1.04)}70%{transform:translate(15px,-12px) scale(0.97)}}
        @keyframes blobDrift2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(22px,-18px) scale(1.03)}65%{transform:translate(-12px,22px) scale(0.97)}}
        .survey-blob-1{animation:blobDrift1 14s ease-in-out infinite}
        .survey-blob-2{animation:blobDrift2 17s ease-in-out infinite}
      `}
      </style>
    </div>
  )
}
