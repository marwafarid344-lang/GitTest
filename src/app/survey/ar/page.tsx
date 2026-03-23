"use client"

import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Send, Loader2, Globe, Gift, Check, Sparkles } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ToastProvider"

import {
  type Question,
  ALL_STEPS_AR as ALL_STEPS,
  TOTAL,
  FORM_MAP,
  AR_TO_EN_MAP,
  FORM_BASE,
  DEMO_COUNT
} from "../questions"

type AnswerVal = string | string[] | number

/* ── Pill — glassmorphism with animated check ─────────────────────────────── */
const Pill = memo(function Pill({ label, selected, accent, onClick, iconUrl }: {
  label: string; selected: boolean; accent: string; onClick: () => void; iconUrl?: string
}) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="relative px-5 py-3.5 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 outline-none text-right overflow-hidden backdrop-blur-sm"
      style={{
        border: `1.5px solid ${selected ? accent : "rgba(255,255,255,0.08)"}`,
        background: selected ? `${accent}12` : "rgba(255,255,255,0.03)",
        color: selected ? "#fff" : "rgba(255,255,255,0.5)",
        boxShadow: selected ? `0 4px 20px ${accent}25, inset 0 1px 0 ${accent}15` : "0 1px 3px rgba(0,0,0,0.2)",
      }}>
      {selected && (
        <motion.div layoutId="pill-glow-ar" className="absolute inset-0 rounded-2xl" style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}05)` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {selected && (
          <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} className="inline-flex items-center justify-center size-4 rounded-full" style={{ background: accent }}>
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
            className="absolute top-1/2 right-4 h-[2px] -translate-y-1/2 rounded-full"
            style={{ background: `linear-gradient(270deg, ${accent}, ${accent2})` }}
            initial={false}
            animate={{ width: `${((value - 1) / 4) * (100 - 8)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = value === n
          const isFilled = value !== null && n <= value
          return (
            <motion.button key={n} onClick={() => onChange(n)}
              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}
              className="relative z-10 flex-1 h-14 md:h-16 rounded-2xl font-bold text-lg md:text-xl transition-all duration-200"
              style={
                isSelected
                  ? { background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff", boxShadow: `0 8px 30px ${accent}40` }
                  : isFilled
                    ? { background: `${accent}20`, border: `2px solid ${accent}40`, color: "#fff" }
                    : { background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }
              }>
              {n}
              {isSelected && (
                <motion.div layoutId="rating-dot-ar" className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full" style={{ background: accent2 }} />
              )}
            </motion.button>
          )
        })}
      </div>
      <div className="flex justify-between mt-3 text-[11px] text-white/25 font-medium">
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
      <motion.div className="h-full relative" initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ background: `linear-gradient(90deg,${accent},${accent2})`, willChange: "width" }}>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-white shadow-lg" style={{ boxShadow: `0 0 10px ${accent}` }} />
      </motion.div>
      <div className="absolute top-3 left-4 text-[10px] text-white/20 font-bold tabular-nums">{step} / {TOTAL}</div>
    </div>
  )
})

// ─── Animation presets ────────────────────────────────────────────────────────
const SLIDE   = { initial: { opacity: 0, x: -70 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 70 } }
const FADE_UP = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } }
const DUR     = { duration: 0.36, ease: [0.16, 1, 0.3, 1] } as const

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SurveyArPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerVal>>({})
  const [otherText, setOtherText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { addToast } = useToast()

  const q: Question | null = step >= 1 && step <= TOTAL ? ALL_STEPS[step - 1] : null
  const answer = q ? answers[q.id] : undefined

  const canProceed = !q
    || (q.type === "radio"       && typeof answer === "string" && answer.length > 0)
    || (q.type === "radio-other" && typeof answer === "string" && answer.length > 0 && (answer !== "أخرى" || otherText.trim().length > 0))
    || (q.type === "checkbox"    && Array.isArray(answer) && (answer as string[]).length > 0)
    || (q.type === "checkbox-other" && Array.isArray(answer) && (answer as string[]).length > 0 && (!(answer as string[]).includes("أخرى") || otherText.trim().length > 0))
    || (q.type === "textarea"    && !q.required)
    || (q.type === "textarea"    && q.required && typeof answer === "string" && (answer as string).trim().length >= 5)
    || (q.type === "text-input"  && !q.required)
    || (q.type === "text-input"  && q.required && typeof answer === "string" && (answer as string).trim().length > 0)
    || (q.type === "rating"      && typeof answer === "number")
    || (q.type === "text-compare" && q.subQuestions != null && q.subQuestions.every(sq => {
         const sqAnswer = answers[sq.id]
         return typeof sqAnswer === "string" && sqAnswer.length > 0
       }))
    || (q.type === "text-display")

  const setAnswer = useCallback((val: AnswerVal) => {
    if (!q) return
    setAnswers((prev) => ({ ...prev, [q.id]: val }))
  }, [q])

  const setSubAnswer = useCallback((subId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [subId]: val }))
  }, [])

  const handleNext = useCallback(async () => {
    // Conditional logic: skip demo-field if High School is selected
    if (q?.id === "demo-education" && answers["demo-education"] === "ثانوية عامة") {
      setAnswers((prev) => ({ ...prev, "demo-field": "Not specialized" }))
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
            // checkbox-other: replace "أخرى" with otherText
            const mapped = (v === "أخرى" && otherText.trim()) ? otherText.trim() : (AR_TO_EN_MAP[v] !== undefined ? AR_TO_EN_MAP[v] : v)
            params.append(entryId, mapped)
          }
        } else if (typeof val === "number") {
          params.append(entryId, String(val))
        } else {
          let finalVal = String(val)
          if (qId === "demo-field" && val === "أخرى" && otherText.trim()) {
            finalVal = otherText.trim()
          } else if (qId === "demo-field" && val === "Not specialized") {
            finalVal = ""
          } else {
            finalVal = AR_TO_EN_MAP[finalVal] !== undefined ? AR_TO_EN_MAP[finalVal] : finalVal
          }

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

      addToast("✅ اتبعت! إجاباتك اتسجلت بنجاح.", "success")
    } catch {
      addToast("⚠️ مشكلة. إجاباتك ممكن ماتكونش اتسجلت. جرب تاني.", "error")
    }
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setStep(TOTAL + 1)
  }, [step, answers, otherText, addToast])

  const handleBack = useCallback(() => {
    const q1Index = ALL_STEPS.findIndex(s => s.id === "q1") + 1
    if (step === q1Index && answers["demo-education"] === "ثانوية عامة") {
      setStep((s) => Math.max(s - 2, 0))
    } else {
      setStep((s) => Math.max(s - 1, 0))
    }
  }, [step, answers])

  const accent  = q?.accent  ?? "#7c3aed"
  const accent2 = q?.accent2 ?? "#db2777"

  const demoSection = "احكيلنا عنك"
  const stepDisplay = q
    ? q.section === demoSection
      ? { label: q.section, counter: `${step} / ${DEMO_COUNT}` }
      : { label: q.section, counter: `${step - DEMO_COUNT} / ${TOTAL - DEMO_COUNT}` }
    : null

  return (
    <div
      dir="rtl"
      lang="ar"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#070710" }}
    >
      {/* Blobs */}
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[120px] opacity-25 survey-blob-1"
        style={{ width: 600, height: 600, background: `radial-gradient(circle,${accent},transparent 70%)`, top: "-15%", left: "-8%", willChange: "transform" }} />
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[100px] opacity-15 survey-blob-2"
        style={{ width: 500, height: 500, background: `radial-gradient(circle,${accent2},transparent 70%)`, bottom: "-10%", right: "-5%", willChange: "transform" }} />

      {/* Progress */}
      {step >= 1 && step <= TOTAL && <ProgressBar step={step} accent={accent} accent2={accent2} />}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-28 py-20">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── مقدمة — creative ── */}
          {step === 0 && (
            <motion.div key="intro" {...FADE_UP} transition={DUR}>
              <motion.div className="flex items-center gap-2 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Image src="/images/1212-removebg-preview.png" alt="Chameleon" width={22} height={22} className="object-contain" />
                <p className="text-[11px] font-bold tracking-widest" style={{ color: "#a855f7", letterSpacing: "0.15em" }}>
                  استبيان كاميليون ٢٠٢٦
                </p>
              </motion.div>

              <motion.h1
                className="font-bold leading-[1.05] text-white mb-5"
                style={{ fontSize: "clamp(2.4rem,7vw,6.5rem)" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                الذكاء الاصطناعي بيكتب.{"\n"}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)", WebkitBackgroundClip: "text" }}>
                  بس هل بيحس؟
                </span>
              </motion.h1>

              <motion.p className="text-base md:text-lg text-white/40 max-w-xl mb-3 leading-loose font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <span className="font-semibold text-white/60">استبيان الانطباعات</span> — هدفه يستكشف ازاي الناس بتشوف كتابة الذكاء الاصطناعي مقارنة بكتابة الإنسان.
              </motion.p>
              <motion.p className="text-sm text-white/20 max-w-xl mb-10 leading-loose font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                إجاباتك مجهولة الهوية وهتُستخدم لأغراض أكاديمية فقط.
              </motion.p>

              <motion.div className="mb-8 p-5 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] flex items-center gap-4 max-w-xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Gift className="w-8 h-8 text-pink-500 animate-bounce shrink-0" />
                <p className="text-sm md:text-base text-white/70 font-medium">
                  سجل بياناتك عشان تدخل السحب العشوائي على هدية قيمة! 🎁
                </p>
              </motion.div>

              <motion.button onClick={() => setStep(1)}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-4 text-white font-bold text-xl md:text-2xl px-10 py-5 rounded-2xl"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", boxShadow: "0 10px 40px rgba(124,58,237,0.3)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ChevronLeft className="w-6 h-6" />
                خلينا نبدأ
              </motion.button>
            </motion.div>
          )}

          {/* ── سؤال — creative ── */}
          {step >= 1 && step <= TOTAL && q && (
            <motion.div key={`q${step}`} {...SLIDE} transition={DUR}>
              {/* Section header — glowing dot */}
              <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <div className="size-2 rounded-full" style={{ background: q.accent, boxShadow: `0 0 8px ${q.accent}66` }} />
                <span className="text-[11px] font-bold tracking-wider" style={{ color: q.accent }}>{stepDisplay?.label}</span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, ${q.accent}30, transparent)` }} />
                <span className="text-[10px] text-white/15 font-bold tabular-nums">{stepDisplay?.counter}</span>
              </motion.div>

              {/* ── Text Display ── */}
              {q.type === "text-display" && q.textContent && (
                <>
                  <motion.div className="inline-flex items-center gap-2 mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                    <span className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ background: `${q.accent}10`, color: q.accent, border: `1px solid ${q.accent}25` }}>{q.textLabel}</span>
                  </motion.div>
                  <h2 className="font-bold leading-[1.05] text-white mb-6" style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", whiteSpace: "pre-line" }}>{q.label}</h2>
                  {q.sub && <p className="text-sm md:text-base text-white/30 mb-6 font-light">{q.sub}</p>}
                  <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] max-w-2xl relative overflow-hidden shadow-lg" style={{ borderRight: `3px solid ${q.accent}` }}>
                    <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-[60px] opacity-[0.06]" style={{ background: q.accent }} />
                    <p className="text-base md:text-lg text-white/60 leading-[1.9] font-light relative z-10">{q.textContent}</p>
                  </div>
                </>
              )}

              {/* ── Text Compare ── */}
              {q.type === "text-compare" && q.subQuestions && (
                <>
                  <motion.div className="inline-flex items-center gap-2 mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                    <span className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ background: `${q.accent}10`, color: q.accent, border: `1px solid ${q.accent}25` }}>{q.textLabel}</span>
                  </motion.div>
                  <h2 className="font-bold leading-[1.05] text-white mb-8" style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", whiteSpace: "pre-line" }}>{q.label}</h2>
                  <div className="space-y-8 max-w-3xl">
                    {q.subQuestions.map((sq, idx) => {
                      const sqAnswer = answers[sq.id] as string | undefined
                      return (
                        <motion.div key={sq.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }} className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]">
                          <p className="text-sm md:text-base text-white/50 font-medium mb-4">
                            <span className="inline-flex items-center justify-center size-5 rounded-full text-[10px] font-bold ml-2" style={{ background: `${q.accent}20`, color: q.accent }}>{idx + 1}</span>
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
                  <motion.h2 className="font-bold leading-[1.05] text-white mb-4 flex items-center gap-4 flex-wrap" style={{ fontSize: "clamp(2.2rem,5.5vw,5rem)", whiteSpace: "pre-line" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <span>{q.label}</span>
                    {q.section === "احكيلنا عنك" && (<Gift className="w-10 h-10 md:w-14 md:h-14 text-pink-500 animate-bounce mt-2" />)}
                  </motion.h2>
                  {q.sub && <motion.p className="text-sm md:text-base text-white/30 mb-10 font-light leading-loose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>{q.sub}</motion.p>}
                  {!q.sub && <div className="mb-10" />}

                  {/* Text Input — animated underline */}
                  {q.type === "text-input" && (
                    <motion.div className="max-w-md" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div className="relative">
                        <input type={q.inputType || "text"} placeholder={q.placeholder} value={(answer as string) || ""} onChange={(e) => setAnswer(e.target.value)} dir={q.inputType === "tel" ? "ltr" : "rtl"}
                          className="w-full bg-transparent text-white text-2xl md:text-3xl font-light placeholder-white/15 outline-none pb-4" style={{ caretColor: q.accent }} />
                        <div className="h-[2px] bg-white/[0.06] rounded-full" />
                        <motion.div className="absolute bottom-0 right-0 h-[2px] rounded-full" style={{ background: `linear-gradient(270deg, ${q.accent}, ${q.accent2})` }} initial={false} animate={{ width: (answer as string)?.trim() ? "100%" : "0%" }} transition={{ duration: 0.4, ease: "easeOut" }} />
                      </div>
                      {!q.required && <p className="text-[11px] text-white/20 mt-3">اختياري — ممكن تتخطاه</p>}
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
                            <Pill label={opt} selected={answer === opt} accent={q.accent} onClick={() => { setAnswer(opt); if (opt !== "أخرى") setOtherText("") }} />
                          </motion.div>
                        ))}
                      </motion.div>
                      {answer === "أخرى" && (
                        <motion.div initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3 }}>
                          <div className="relative mt-5 max-w-md">
                            <input type="text" placeholder="حدد مجالك…" value={otherText} onChange={(e) => setOtherText(e.target.value)} autoFocus className="w-full bg-transparent text-white text-lg font-light placeholder-white/15 outline-none pb-3" style={{ caretColor: q.accent }} />
                            <div className="h-[2px] bg-white/[0.06] rounded-full" />
                            <motion.div className="absolute bottom-0 right-0 h-[2px] rounded-full" style={{ background: q.accent }} initial={false} animate={{ width: otherText.trim() ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
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
                              <Pill label={opt} selected={checked} accent={q.accent} iconUrl={q.optionIcons?.[opt]} onClick={() => { const prev = (answer as string[]) || []; const next = checked ? prev.filter((v) => v !== opt) : [...prev, opt]; setAnswer(next); if (opt === "أخرى" && checked) setOtherText("") }} />
                            </motion.div>
                          )
                        })}
                      </motion.div>
                      {Array.isArray(answer) && (answer as string[]).includes("أخرى") && (
                        <motion.div initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3 }}>
                          <div className="relative mt-5 max-w-md">
                            <input type="text" placeholder="حدد إجابتك…" value={otherText} onChange={(e) => setOtherText(e.target.value)} autoFocus className="w-full bg-transparent text-white text-lg font-light placeholder-white/15 outline-none pb-3" style={{ caretColor: q.accent }} />
                            <div className="h-[2px] bg-white/[0.06] rounded-full" />
                            <motion.div className="absolute bottom-0 right-0 h-[2px] rounded-full" style={{ background: q.accent }} initial={false} animate={{ width: otherText.trim() ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Textarea */}
                  {q.type === "textarea" && (
                    <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <textarea rows={5} value={(answer as string) || ""} onChange={(e) => setAnswer(e.target.value)} placeholder={q.placeholder}
                        className="w-full bg-white/[0.02] backdrop-blur-sm text-white text-lg md:text-xl font-light placeholder-white/15 resize-none outline-none rounded-2xl p-5 border border-white/[0.06] transition-all duration-300 focus:border-transparent text-right leading-loose"
                        style={{ caretColor: q.accent, boxShadow: (answer as string)?.trim() ? `0 0 0 1.5px ${q.accent}40, 0 4px 20px ${q.accent}10` : "none" }} />
                      <div className="flex items-center justify-between mt-2">
                        {q.required ? (
                          <p className="text-[11px] text-white/20" dir="ltr">{((answer as string) || "").trim().length} chars{((answer as string) || "").trim().length < 5 && <span style={{ color: q.accent }}> · اكتب ٥ حروف على الأقل</span>}</p>
                        ) : (<p className="text-[11px] text-white/15">اختياري</p>)}
                        {(answer as string)?.trim() && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-1.5 rounded-full" style={{ background: q.accent }} />}
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {/* ── Nav — creative ── */}
              <motion.div className="flex items-center gap-4 mt-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
                  }>
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال…</> : step === TOTAL ? <><Send className="w-4 h-4" /> إرسال</> : <>التالي <ChevronLeft className="w-4 h-4" /></>}
                </motion.button>
                <button onClick={handleBack} className="flex items-center gap-2 text-white/20 hover:text-white/45 transition-all duration-300 text-sm font-medium hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5" /> رجوع
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── شكراً — creative ── */}
          {step === TOTAL + 1 && (
            <motion.div key="done" {...FADE_UP} transition={DUR} className="text-center flex flex-col items-center">
              <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 15 }} className="relative mb-8">
                <div className="size-24 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }}>
                    <Check className="size-12 text-purple-400" strokeWidth={3} />
                  </motion.div>
                </div>
                <Sparkles className="absolute -top-1 -right-1 size-6 text-pink-400 animate-pulse" />
                <Sparkles className="absolute -bottom-1 -left-2 size-4 text-purple-400/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </motion.div>
              <motion.p className="text-[11px] font-bold tracking-wider mb-4" style={{ color: "#a855f7", letterSpacing: "0.1em" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>✦ خلصنا</motion.p>
              <h2 className="font-bold leading-[1.05] text-white mb-6" style={{ fontSize: "clamp(2.8rem,8.5vw,8rem)" }}>
                ده كان معناه{" "}<span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>كل حاجة.</span>
              </h2>
              <p className="text-lg md:text-2xl text-white/35 max-w-lg mb-14 leading-loose font-light">
                كل إجابة هتتحلل عشان نفهم ازاي الناس بتشوف كتابة الذكاء الاصطناعي.<br />
                <span className="text-white/20 text-base">إجاباتك مجهولة ومش هتتشارك بشكل فردي أبداً.</span>
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CSS blob drift */}
      <style>{`
        @keyframes blobDrift1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(25px,18px) scale(1.04)}70%{transform:translate(-15px,-12px) scale(0.97)}}
        @keyframes blobDrift2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-22px,-18px) scale(1.03)}65%{transform:translate(12px,22px) scale(0.97)}}
        .survey-blob-1{animation:blobDrift1 14s ease-in-out infinite}
        .survey-blob-2{animation:blobDrift2 17s ease-in-out infinite}
      `}</style>
    </div>
  )
}
