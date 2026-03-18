"use client"

import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Send, Loader2, Globe, Gift } from "lucide-react"
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

// ─── Pill ─────────────────────────────────────────────────────────────────────
const Pill = memo(function Pill({ label, selected, accent, onClick }: {
  label: string; selected: boolean; accent: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} className="px-5 py-3 rounded-full text-sm md:text-base font-medium transition-[border-color,background,color,box-shadow] duration-200 outline-none text-right"
      style={{
        border: `2px solid ${selected ? accent : "rgba(255,255,255,0.12)"}`,
        background: selected ? `${accent}22` : "rgba(255,255,255,0.04)",
        color: selected ? "#fff" : "rgba(255,255,255,0.55)",
        boxShadow: selected ? `0 0 20px ${accent}44` : "none",
      }}>
      {label}
    </button>
  )
})

// ─── Rating scale (1–5 cubes) ─────────────────────────────────────────────────
const RatingScale = memo(function RatingScale({ value, onChange, minLabel, maxLabel, accent, accent2 }: {
  value: number | null; onChange: (v: number) => void
  minLabel: string; maxLabel: string; accent: string; accent2: string
}) {
  return (
    <div>
      <div className="flex gap-3 mt-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)}
            className="flex-1 h-14 md:h-16 rounded-2xl font-bold text-lg md:text-xl transition-[transform,background,box-shadow,color] duration-150"
            style={
              value === n
                ? { background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff", boxShadow: `0 6px 24px ${accent}55`, transform: "scale(1.08)" }
                : { background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
            }>
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-white/35 font-medium">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
})

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = memo(function ProgressBar({ step, accent, accent2 }: { step: number; accent: string; accent2: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
      <motion.div className="h-full" initial={false}
        animate={{ width: `${(step / TOTAL) * 100}%` }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ background: `linear-gradient(90deg,${accent},${accent2})`, willChange: "width" }} />
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

          {/* ── مقدمة ── */}
          {step === 0 && (
            <motion.div key="intro" {...FADE_UP} transition={DUR}>
              <div className="flex items-center gap-2 mb-6">
                <Image src="/images/1212-removebg-preview.png" alt="Chameleon" width={22} height={22} className="object-contain" />
                <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#a855f7", letterSpacing: "0.1em" }}>
                  استبيان كاميليون 2026
                </p>
              </div>

              <h1 className="font-bold leading-[1.1] text-white mb-4" style={{ fontSize: "clamp(2.4rem,7vw,6.5rem)" }}>
                كتابة الذكاء الاصطناعي<br />
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>
                  مقابل كتابة الإنسان.
                </span>
              </h1>

              <p className="text-base md:text-lg text-white/50 max-w-xl mb-3 leading-loose font-light">
                <span className="font-semibold text-white/70">استبيان الانطباعات</span> — الاستبيان ده هدفه يستكشف انطباعات الناس عن كتابة الذكاء الاصطناعي مقارنة بكتابة الإنسان.
              </p>
              <p className="text-sm text-white/30 max-w-xl mb-8 leading-loose font-light">
                إجاباتك مجهولة الهوية وهتُستخدم لأغراض أكاديمية فقط.
              </p>

              <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 max-w-xl">
                <Gift className="w-8 h-8 text-pink-500 animate-bounce shrink-0" />
                <p className="text-sm md:text-base text-white/80 font-medium">
                  سجل بياناتك عشان تدخل السحب العشوائي على هدية قيمة! 🎁
                </p>
              </div>

              {/* Section tags */}
              <div className="flex flex-wrap gap-2 mb-12">
                {["احكيلنا عنك", "١ · الانطباعات", "٢ · مقارنة النصوص", "٣ · أدوات وملاحظات"].map((s) => (
                  <span key={s} className="text-xs font-medium px-3 py-1 rounded-full border border-white/10 text-white/40">{s}</span>
                ))}
              </div>

              <button onClick={() => setStep(1)}
                className="inline-flex items-center gap-4 text-white font-bold text-xl md:text-2xl px-10 py-5 rounded-2xl transition-transform duration-200 hover:scale-[1.04] active:scale-95"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
                <ChevronLeft className="w-6 h-6" />
                خلينا نبدأ
              </button>
            </motion.div>
          )}

          {/* ── سؤال ── */}
          {step >= 1 && step <= TOTAL && q && (
            <motion.div key={`q${step}`} {...SLIDE} transition={DUR}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-wider" style={{ color: q.accent }}>{stepDisplay?.label}</span>
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs text-white/25 font-medium">{stepDisplay?.counter}</span>
              </div>

              {/* ── Text Display (سلايد القراءة فقط) ── */}
              {q.type === "text-display" && q.textContent && (
                <>
                  {/* Text label badge */}
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{ background: `${q.accent}22`, color: q.accent, border: `1px solid ${q.accent}44` }}
                    >
                      {q.textLabel}
                    </span>
                  </div>

                  {/* Question label */}
                  <h2 className="font-bold leading-[1.1] text-white mb-6"
                    style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", whiteSpace: "pre-line" }}>
                    {q.label}
                  </h2>
                  {q.sub && <p className="text-sm md:text-base text-white/40 mb-6 font-light">{q.sub}</p>}

                  {/* Text passage */}
                  <div className="p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-white/10 max-w-2xl"
                    style={{ borderRight: `4px solid ${q.accent}` }}>
                    <p className="text-base md:text-lg text-white/80 leading-[1.9] font-light">
                      {q.textContent}
                    </p>
                  </div>
                </>
              )}

              {/* ── Text Compare (أسئلة فقط) ── */}
              {q.type === "text-compare" && q.subQuestions && (
                <>
                  {/* Text label badge */}
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{ background: `${q.accent}22`, color: q.accent, border: `1px solid ${q.accent}44` }}
                    >
                      {q.textLabel}
                    </span>
                  </div>

                  {/* Question label */}
                  <h2 className="font-bold leading-[1.1] text-white mb-6"
                    style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", whiteSpace: "pre-line" }}>
                    {q.label}
                  </h2>

                  {/* Sub-questions */}
                  <div className="space-y-10 max-w-3xl">
                    {q.subQuestions.map((sq, idx) => {
                      const sqAnswer = answers[sq.id] as string | undefined
                      return (
                        <div key={sq.id}>
                          <p className="text-sm md:text-base text-white/60 font-medium mb-4">
                            <span className="text-white/30 ml-2">{idx + 1}.</span>
                            {sq.label}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {sq.options.map((opt) => (
                              <Pill key={opt} label={opt} selected={sqAnswer === opt} accent={q.accent}
                                onClick={() => setSubAnswer(sq.id, opt)} />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* ── Non-text-compare / non-text-display questions ── */}
              {q.type !== "text-compare" && q.type !== "text-display" && (
                <>
                  <h2 className="font-bold leading-[1.1] text-white mb-4 flex items-center gap-4 flex-wrap"
                    style={{ fontSize: "clamp(2.4rem,5.5vw,5rem)", whiteSpace: "pre-line" }}>
                    <span>{q.label}</span>
                    {q.section === "احكيلنا عنك" && (
                      <Gift className="w-10 h-10 md:w-14 md:h-14 text-pink-500 animate-bounce mt-2" />
                    )}
                  </h2>
                  {q.sub && <p className="text-sm md:text-base text-white/40 mb-10 font-light leading-loose">{q.sub}</p>}
                  {!q.sub && <div className="mb-10" />}

                  {/* ── Text Input (phone) ── */}
                  {q.type === "text-input" && (
                    <div className="max-w-md">
                      <input
                        type={q.inputType || "text"}
                        placeholder={q.placeholder}
                        value={(answer as string) || ""}
                        onChange={(e) => setAnswer(e.target.value)}
                        dir={q.inputType === "tel" ? "ltr" : "rtl"}
                        className="w-full bg-transparent text-white text-2xl md:text-3xl font-light placeholder-white/20 outline-none border-b-2 pb-4 transition-[border-color] duration-300"
                        style={{ borderColor: (answer as string)?.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                      />
                      {!q.required && (
                        <p className="text-xs text-white/25 mt-3 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/15" />
                          اختياري — ممكن تتخطاه
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── Rating (5 cubes) ── */}
                  {q.type === "rating" && (
                    <div className="max-w-lg">
                      <RatingScale
                        value={(answer as number) ?? null}
                        onChange={setAnswer}
                        minLabel={q.minLabel ?? ""}
                        maxLabel={q.maxLabel ?? ""}
                        accent={q.accent} accent2={q.accent2} />
                    </div>
                  )}

                  {/* Radio */}
                  {q.type === "radio" && q.options && (
                    <div className="flex flex-wrap gap-3 max-w-3xl">
                      {q.options.map((opt) => (
                        <Pill key={opt} label={opt} selected={answer === opt} accent={q.accent}
                          onClick={() => setAnswer(opt)} />
                      ))}
                    </div>
                  )}

                  {/* Radio with "Other" */}
                  {q.type === "radio-other" && q.options && (
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-3">
                        {q.options.map((opt) => (
                          <Pill key={opt} label={opt} selected={answer === opt} accent={q.accent}
                            onClick={() => { setAnswer(opt); if (opt !== "أخرى") setOtherText("") }} />
                        ))}
                      </div>
                      {answer === "أخرى" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                          <input
                            type="text"
                            placeholder="حدد مجالك…"
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            autoFocus
                            className="mt-5 w-full max-w-md bg-transparent text-white text-lg font-light placeholder-white/20 outline-none border-b-2 pb-3 transition-[border-color] duration-300"
                            style={{ borderColor: otherText.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Checkbox */}
                  {q.type === "checkbox" && q.options && (
                    <div className="flex flex-wrap gap-3 max-w-3xl">
                      {q.options.map((opt) => {
                        const checked = Array.isArray(answer) && (answer as string[]).includes(opt)
                        return (
                          <Pill key={opt} label={opt} selected={checked} accent={q.accent}
                            onClick={() => {
                              const prev = (answer as string[]) || []
                              setAnswer(checked ? prev.filter((v) => v !== opt) : [...prev, opt])
                            }} />
                        )
                      })}
                    </div>
                  )}

                  {/* Checkbox with "Other" */}
                  {q.type === "checkbox-other" && q.options && (
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-3">
                        {q.options.map((opt) => {
                          const checked = Array.isArray(answer) && (answer as string[]).includes(opt)
                          return (
                            <Pill key={opt} label={opt} selected={checked} accent={q.accent}
                              onClick={() => {
                                const prev = (answer as string[]) || []
                                const next = checked ? prev.filter((v) => v !== opt) : [...prev, opt]
                                setAnswer(next)
                                if (opt === "أخرى" && checked) setOtherText("")
                              }} />
                          )
                        })}
                      </div>
                      {Array.isArray(answer) && (answer as string[]).includes("أخرى") && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                          <input
                            type="text"
                            placeholder="حدد إجابتك…"
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            autoFocus
                            className="mt-5 w-full max-w-md bg-transparent text-white text-lg font-light placeholder-white/20 outline-none border-b-2 pb-3 transition-[border-color] duration-300"
                            style={{ borderColor: otherText.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Textarea */}
                  {q.type === "textarea" && (
                    <div className="max-w-2xl">
                      <textarea rows={5}
                        value={(answer as string) || ""}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder={q.placeholder}
                        className="w-full bg-transparent text-white text-lg md:text-xl font-light placeholder-white/20 resize-none outline-none border-b-2 pb-4 transition-[border-color] duration-300 text-right leading-loose"
                        style={{ borderColor: (answer as string)?.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                      />
                      {q.required && (
                        <p className="text-xs text-white/20 mt-2 text-left" dir="ltr">
                          {((answer as string) || "").trim().length} chars
                          {((answer as string) || "").trim().length < 5 && " · اكتب 5 حروف على الأقل"}
                        </p>
                      )}
                      {!q.required && (
                        <p className="text-xs text-white/20 mt-2">اختياري</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-6 mt-12">
                <button
                  onClick={canProceed && !submitting ? handleNext : undefined}
                  disabled={!canProceed || submitting}
                  className="flex items-center gap-3 font-bold text-base md:text-lg px-7 py-4 rounded-2xl transition-[transform,opacity] duration-200 hover:scale-[1.04] active:scale-95 disabled:cursor-not-allowed"
                  style={
                    canProceed && !submitting
                      ? { background: `linear-gradient(135deg,${q.accent},${q.accent2})`, color: "#fff", boxShadow: `0 10px 32px ${q.accent}44` }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.08)" }
                  }>
                  {submitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال…</>
                    : step === TOTAL
                    ? <><Send className="w-4 h-4" /> إرسال</>
                    : <>التالي <ChevronLeft className="w-4 h-4" /></>}
                </button>

                <button onClick={handleBack}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm font-medium">
                  <ChevronRight className="w-4 h-4" />
                  رجوع
                </button>
              </div>
            </motion.div>
          )}

          {/* ── شكراً ── */}
          {step === TOTAL + 1 && (
            <motion.div key="done" {...FADE_UP} transition={DUR}>
              <div className="mb-10 text-6xl">🎉</div>
              <p className="text-sm font-bold tracking-widest mb-4" style={{ color: "#a855f7", letterSpacing: "0.08em" }}>
                ✦ خلصنا
              </p>
              <h2 className="font-bold leading-[1.1] text-white mb-6"
                style={{ fontSize: "clamp(2.8rem,8.5vw,8rem)" }}>
                شكراً جداً،{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>
                  بجد.
                </span>
              </h2>
              <p className="text-lg md:text-2xl text-white/45 max-w-lg mb-14 leading-loose font-light">
                كل إجابة هتتحلل عشان نفهم ازاي الناس بتشوف كتابة الذكاء الاصطناعي.<br />
                <span className="text-white/25 text-base">إجاباتك مجهولة ومش هتتشارك بشكل فردي أبداً.</span>
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
