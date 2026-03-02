"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import SurveyIntroBackground from "@/components/survey-intro/SurveyIntroBackground"
import { useMouseParallax } from "@/hooks/use-gsap-survey-intro"

interface Slide {
  id: string
  render: () => React.ReactNode
}

function TypingText({ text, className = "" }: { text: string; className?: string }) {
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    el.textContent = ""

    let i = 0
    const chars = [...text]
    const id = setInterval(() => {
      if (i < chars.length) {
        el.textContent += chars[i]
        i++
      } else {
        clearInterval(id)
      }
    }, 35)
    return () => clearInterval(id)
  }, [text])

  return <span ref={elRef} className={className} />
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: "power2.out",
      delay: 0.3,
      onUpdate() {
        el.textContent = Math.round(obj.val) + suffix
      },
    })
  }, [target, suffix])

  return <span ref={elRef}>0{suffix}</span>
}


const SLIDES: Slide[] = [
  {
    id: "greeting",
    render: () => (
      <>
        {/* Decorative top icon */}
        <div className="survey-float mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 via-blue-500/15 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_40px_rgba(139,92,246,0.12)]">
            👋
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] mb-2">
          <span className="bg-gradient-to-l from-violet-300 via-white to-blue-200 bg-clip-text text-transparent">
            أهلًا بيك
          </span>
        </h1>

        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 mx-auto my-6 opacity-60" />

        <p className="text-white/50 text-base sm:text-lg md:text-xl leading-[1.9] max-w-lg">
          الذكاء الاصطناعي بقى داخل في حياتنا اليومية بشكل كبير، خصوصًا في
          الكتابة — سواء في الدراسة، الشغل، أو حتى على السوشيال ميديا.
        </p>
      </>
    ),
  },

  {
    id: "question",
    render: () => (
      <>
        <div className="survey-float mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            🤔
          </div>
        </div>

        <p className="text-white/90 font-bold text-2xl sm:text-3xl md:text-4xl mb-9 leading-snug">
          <TypingText text="بس السؤال المهم:" className="bg-gradient-to-l from-violet-300 to-blue-300 bg-clip-text text-transparent" />
          <span className="inline-block w-0.5 h-7 bg-violet-400 mr-1 animate-pulse align-middle" />
        </p>

        <div className="space-y-4 w-full max-w-md">
          {[
            { color: "from-violet-500 to-violet-600", icon: "✦", text: "إحنا فعلًا بنفضل كتابة الـ AI؟" },
            { color: "from-blue-500 to-blue-600", icon: "✦", text: "بنقدر نفرق بينها وبين كتابة الإنسان؟" },
            { color: "from-purple-500 to-purple-600", icon: "✦", text: "ومين فيهم بيدينا ثقة أكتر؟" },
          ].map((item, i) => (
            <div
              key={i}
              className="survey-question-card group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] transition-[background-color,opacity] duration-300"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                {item.icon}
              </div>
              <span className="text-white/60 text-base sm:text-lg leading-relaxed pt-1">{item.text}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },

  {
    id: "purpose",
    render: () => (
      <>
        <div className="flex items-center gap-6 sm:gap-10 mb-10">
          {[
            { val: 21, suffix: "+", label: "سؤال" },
            { val: 4, suffix: "", label: "محاور" },
            { val: 5, suffix: " دقائق", label: "فقط" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                <AnimatedCounter target={s.val} suffix={s.suffix} />
              </div>
              <div className="text-white/25 text-xs sm:text-sm mt-1.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="survey-glass-card relative rounded-3xl border border-white/[0.07] bg-white/[0.04] p-6 sm:p-8 md:p-10 max-w-lg w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/25 to-blue-500/25 flex items-center justify-center text-xl">
              🎯
            </div>
            <h2 className="text-white/90 font-bold text-lg sm:text-xl">هدف الاستبيان</h2>
          </div>

          <p className="text-white/50 text-sm sm:text-base leading-[1.9]">
            الاستبيان ده هدفه يعرف رأيك الحقيقي في الفرق بين كتابة الإنسان وكتابة
            الذكاء الاصطناعي من ناحية المشاعر، الإبداع، الثقة، والجودة بشكل عام
            بالإضافة لتطوير نماذج الذكاء الاصطناعي وتحسين كفائتها في الكتابة.
          </p>
        </div>
      </>
    ),
  },

  {
    id: "privacy",
    render: () => (
      <>
        <div className="survey-glass-card relative rounded-3xl border border-white/[0.07] bg-white/[0.04] p-6 sm:p-8 md:p-10 max-w-lg w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(16,185,129,0.08)]">
              🛡️
            </div>
            <div>
              <h2 className="text-white/90 font-bold text-lg sm:text-xl">مهم جدًا</h2>
              <p className="text-white/30 text-xs">خصوصيتك محمية بالكامل</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🔒", text: "مش بنطلب أي بيانات شخصية أو قانونية خالص" },
              { icon: "📊", text: "إجاباتك هتستخدم لأغراض بحثية بس" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <span className="text-white/45 text-sm sm:text-base leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-6" />

          <p className="text-white/35 text-sm leading-relaxed text-center">
            الموضوع مش هياخد منك غير كام دقيقة
            <br />
            <span className="text-white/60 font-semibold text-base">
              رأيك مهم جدًا ❤️
            </span>
          </p>
        </div>
      </>
    ),
  },

  {
    id: "lang",
    render: () => (
      <>
        <div className="survey-float mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/[0.08] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            🌍
          </div>
        </div>

        <p className="text-white/80 font-bold text-xl sm:text-2xl md:text-3xl mb-3 leading-snug">
          من فضلك اختار اللغة
        </p>
        <p className="text-white/30 text-sm mb-10">اللي تحب تكمل بيها الاستبيان</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-lg">
          <Link
            href="/survey/ar"
            className="survey-lang-card group relative block rounded-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a14]"
            aria-label="متابعة باللغة العربية"
          >
            <div className="relative p-7 sm:p-8 border border-white/[0.07] bg-white/[0.04] rounded-2xl transition-[transform,border-color,background-color,box-shadow] duration-400 hover:border-violet-500/25 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(139,92,246,0.12)] hover:-translate-y-1">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 text-violet-500">🇪🇬</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">عربي</h3>
              <p className="text-white/25 text-xs sm:text-sm">النسخة العربية المصرية</p>
            </div>
          </Link>

          <Link
            href="/survey/en"
            className="survey-lang-card group relative block rounded-2xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a14]"
            aria-label="Continue in English"
          >
            <div className="relative p-7 sm:p-8 border border-white/[0.07] bg-white/[0.04] rounded-2xl transition-[transform,border-color,background-color,box-shadow] duration-400 hover:border-blue-500/25 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(59,130,246,0.12)] hover:-translate-y-1">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 text-purple-500">🇬🇧</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>English</h3>
              <p className="text-white/25 text-xs sm:text-sm">English Version</p>
            </div>
          </Link>
        </div>
      </>
    ),
  },
]

const SLIDE_DURATIONS = [5000, 6000, 6000, 5500, Infinity]

export default function SurveyIntro() {
  const pageRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAnimating = useRef(false)
  const progressBarRef = useRef<(HTMLDivElement | null)[]>([])

  useMouseParallax(contentRef, 4)

  useEffect(() => {
    if (!pageRef.current) return
    const tl = gsap.timeline()
    tl.to(pageRef.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
    return () => { tl.kill() }
  }, [])

   const animateSlideIn = useCallback(() => {
    const el = slideRef.current
    if (!el) return

    const children = el.querySelectorAll("[data-s]")
    gsap.set(el, { opacity: 1 })
    gsap.set(children, { y: 32, opacity: 0, willChange: "transform, opacity" })

    const tl = gsap.timeline({
      onComplete() {
        gsap.set(children, { willChange: "auto" })
        isAnimating.current = false
      },
    })

    tl.to(children, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.08,
      force3D: true,
    })

    return tl
  }, [])

  const animateSlideOut = useCallback((nextIdx: number) => {
    const el = slideRef.current
    if (!el) return
    isAnimating.current = true

    const children = el.querySelectorAll("[data-s]")

    gsap.to(children, {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.03,
      force3D: true,
      onComplete() {
        setCurrent(nextIdx)
      },
    })
  }, [])

  useEffect(() => {
    const tl = animateSlideIn()
    return () => { tl?.kill() }
  }, [current, animateSlideIn])

  useEffect(() => {
    const bar = progressBarRef.current[current]
    if (!bar) return

    const dur = SLIDE_DURATIONS[current]
    if (dur === Infinity) {
      gsap.set(bar, { scaleX: 1 })
      return
    }

    gsap.set(bar, { scaleX: 0 })
    const tween = gsap.to(bar, {
      scaleX: 1,
      duration: dur / 1000,
      ease: "none",
    })

    return () => { tween.kill() }
  }, [current])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const dur = SLIDE_DURATIONS[current]
    if (dur === Infinity) return

    timerRef.current = setTimeout(() => {
      if (!isAnimating.current && current < SLIDES.length - 1) {
        animateSlideOut(current + 1)
      }
    }, dur)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, animateSlideOut])

  const handleTap = useCallback(() => {
    if (isAnimating.current) return
    if (current >= SLIDES.length - 1) return
    if (timerRef.current) clearTimeout(timerRef.current)
    animateSlideOut(current + 1)
  }, [current, animateSlideOut])

  return (
    <div
      ref={pageRef}
      dir="rtl"
      lang="ar"
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden opacity-0 cursor-default"
      style={{ fontFamily: "'Cairo', sans-serif" }}
      onClick={handleTap}
      role="presentation"
    >
      <SurveyIntroBackground />

      <div className="fixed top-0 inset-x-0 z-50 flex gap-1.5 px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              ref={(el) => { progressBarRef.current[i] = el }}
              className="h-full rounded-full origin-right"
              style={{
                background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                transform: i < current ? "scaleX(1)" : "scaleX(0)",
                opacity: i < current ? 0.4 : 1,
              }}
            />
          </div>
        ))}
      </div>

      <div className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-40">
        <span className="text-white/15 text-[11px] font-mono tracking-widest">
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-10 flex flex-col items-center">
        <div ref={contentRef}>
          <div
            ref={slideRef}
            className="flex flex-col items-center text-center min-h-[380px] sm:min-h-[420px] justify-center"
          >
            <SlideContent slide={SLIDES[current]} />
          </div>
        </div>
      </div>

      {current === 0 && (
        <div className="fixed bottom-12 inset-x-0 flex justify-center z-30 pointer-events-none">
          <span className="flex items-center gap-2 text-white/15 text-xs animate-pulse tracking-wide">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
            اضغط في أي مكان للتخطي
          </span>
        </div>
      )}

      {current < SLIDES.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isAnimating.current) return
            if (timerRef.current) clearTimeout(timerRef.current)
            animateSlideOut(SLIDES.length - 1)
          }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-1.5 text-white/15 hover:text-white/45 text-xs transition-all duration-300 group focus-visible:outline-none focus-visible:text-white/60"
          aria-label="تخطي إلى اختيار اللغة"
        >
          <span className="underline underline-offset-4 decoration-white/10 group-hover:decoration-white/25">تخطي</span>
          <svg className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      )}

      <p className="fixed bottom-2.5 inset-x-0 text-center text-white/[0.06] text-[10px] tracking-[0.2em] z-20 pointer-events-none uppercase">
        Academic Research
      </p>
    </div>
  )
}

function SlideContent({ slide }: { slide: Slide }) {
  const node = slide.render()

  if (node && typeof node === "object" && "props" in node && node.props.children) {
    const kids = Array.isArray(node.props.children)
      ? node.props.children
      : [node.props.children]

    return (
      <>
        {kids.map((child: React.ReactNode, i: number) => (
          <div key={i} data-s="">
            {child}
          </div>
        ))}
      </>
    )
  }

  return <div data-s="">{node}</div>
}

