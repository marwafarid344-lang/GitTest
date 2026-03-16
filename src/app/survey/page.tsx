"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"

/* ═══════════════════════════════════════════════════════════════════════════════
   Survey Intro — /survey
   Simple slide-based intro with manual next/prev arrows (RTL, Rubik)
   ═══════════════════════════════════════════════════════════════════════════ */

interface Slide {
  id: string
  render: () => React.ReactNode
}

/* ── Slide definitions ─────────────────────────────────────────────────── */

const SLIDES: Slide[] = [
  /* ──────── 0 — Greeting ──────── */
  {
    id: "greeting",
    render: () => (
      <>
        <div className="mb-6 text-5xl sm:text-6xl">👋</div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] mb-3">
          <span className="bg-gradient-to-l from-violet-300 via-white to-blue-200 bg-clip-text text-transparent">
            أهلًا بيك
          </span>
        </h1>

        <div className="w-14 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 mx-auto my-5 opacity-50" />

        <p className="text-white/50 text-base sm:text-lg leading-[1.9] max-w-md">
          الذكاء الاصطناعي بقى داخل في حياتنا اليومية بشكل كبير، خصوصًا في
          الكتابة — سواء في الدراسة، الشغل، أو حتى على السوشيال ميديا.
        </p>
      </>
    ),
  },

  /* ──────── 1 — The Question ──────── */
  {
    id: "question",
    render: () => (
      <>
        <div className="mb-5 text-4xl">🤔</div>

        <p className="text-white/90 font-bold text-xl sm:text-2xl md:text-3xl mb-8 leading-snug">
          بس السؤال المهم:
        </p>

        <div className="space-y-4 w-full max-w-md">
          {[
            { color: "from-violet-500 to-violet-600", text: "إحنا فعلًا بنفضل كتابة الـ AI؟" },
            { color: "from-blue-500 to-blue-600", text: "بنقدر نفرق بينها وبين كتابة الإنسان؟" },
            { color: "from-purple-500 to-purple-600", text: "ومين فيهم بيدينا ثقة أكتر؟" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${item.color}`} />
              <span className="text-white/50 text-sm sm:text-base leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },

  /* ──────── 2 — Purpose ──────── */
  {
    id: "purpose",
    render: () => (
      <>
        {/* Stats row */}
        <div className="flex items-center gap-8 sm:gap-12 mb-8">
          {[
            { val: "21+", label: "سؤال" },
            { val: "5", label: "محاور" },
            { val: "5 دقائق", label: "فقط" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                {s.val}
              </div>
              <div className="text-white/25 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-lg w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🎯</span>
            <h2 className="text-white/90 font-bold text-lg">هدف الاستبيان</h2>
          </div>

          <p className="text-white/45 text-sm sm:text-base leading-[1.9]">
            الاستبيان ده هدفه يعرف رأيك الحقيقي في الفرق بين كتابة الإنسان وكتابة
            الذكاء الاصطناعي من ناحية المشاعر، الإبداع، الثقة، والجودة بشكل عام
            بالإضافة لتطوير نماذج الذكاء الاصطناعي وتحسين كفائتها في الكتابة.
          </p>
        </div>
      </>
    ),
  },

  /* ──────── 3 — Privacy ──────── */
  {
    id: "privacy",
    render: () => (
      <>
        <div className="max-w-lg w-full">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl">🛡️</span>
            <div>
              <h2 className="text-white/90 font-bold text-lg">مهم جدًا</h2>
              <p className="text-white/25 text-xs">خصوصيتك محمية بالكامل</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🔒", text: "مش بنطلب أي بيانات شخصية أو قانونية خالص" },
              { icon: "📊", text: "إجاباتك هتستخدم لأغراض بحثية بس" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{item.icon}</span>
                <span className="text-white/40 text-sm leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="w-12 h-px bg-white/[0.06] mx-auto my-6" />

          <p className="text-white/30 text-sm leading-relaxed text-center">
            الموضوع مش هياخد منك غير كام دقيقة
            <br />
            <span className="text-white/55 font-semibold">رأيك مهم جدًا ❤️</span>
          </p>
        </div>
      </>
    ),
  },

  /* ──────── 4 — Language Choice ──────── */
  {
    id: "lang",
    render: () => (
      <>
        <div className="mb-5 text-4xl">🌍</div>

        <p className="text-white/80 font-bold text-xl sm:text-2xl mb-2">
          من فضلك اختار اللغة
        </p>
        <p className="text-white/25 text-sm mb-8">اللي تحب تكمل بيها الاستبيان</p>

        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
          {/* Arabic */}
          <Link
            href="/survey/ar"
            className="group flex flex-col items-center text-center focus-visible:outline-none"
            aria-label="متابعة باللغة العربية"
          >
            <div className="relative flex items-center justify-center w-20 h-20 mb-4 transition-transform duration-500 group-hover:-translate-y-2">
              {/* Outer spinning ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-white/20 group-hover:border-violet-500/60 transition-colors duration-500"
                style={{ animation: "spin 8s linear infinite" }}
              />
              {/* Inner reverse spinning ring */}
              <div
                className="absolute inset-1.5 rounded-full border border-dotted border-white/10 group-hover:border-violet-400/50 transition-colors duration-700"
                style={{ animation: "spin 12s linear infinite reverse" }}
              />
              {/* Center core */}
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white/80 group-hover:bg-violet-500/20 group-hover:border-violet-500/50 group-hover:text-violet-300 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] overflow-hidden">
                {/* Floating shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out" />
                <svg className="relative z-10 w-7 h-7 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" />
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors duration-200">عربي</h3>
            <p className="text-white/25 text-xs sm:text-sm">النسخة العربية المصرية</p>
          </Link>

          <div className="hidden sm:block w-px h-16 bg-white/[0.06]" />
          <div className="sm:hidden w-16 h-px bg-white/[0.06]" />

          {/* English */}
          <Link
            href="/survey/en"
            className="group flex flex-col items-center text-center focus-visible:outline-none"
            aria-label="Continue in English"
          >
            <div className="relative flex items-center justify-center w-20 h-20 mb-4 transition-transform duration-500 group-hover:-translate-y-2">
              {/* Outer spinning ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-white/20 group-hover:border-blue-500/60 transition-colors duration-500"
                style={{ animation: "spin 8s linear infinite" }}
              />
              {/* Inner reverse spinning ring */}
              <div
                className="absolute inset-1.5 rounded-full border border-dotted border-white/10 group-hover:border-blue-400/50 transition-colors duration-700"
                style={{ animation: "spin 12s linear infinite reverse" }}
              />
              {/* Center core */}
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white/80 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 group-hover:text-blue-300 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] overflow-hidden">
                {/* Floating shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out" />
                <svg className="relative z-10 w-7 h-7 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-200">English</h3>
            <p className="text-white/25 text-xs sm:text-sm">English Version</p>
          </Link>
        </div>
      </>
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function SurveyIntro() {
  const pageRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const isAnimating = useRef(false)

  const isFirst = current === 0
  const isLast = current === SLIDES.length - 1

  /* ── Page entrance ── */
  useEffect(() => {
    if (!pageRef.current) return
    gsap.to(pageRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" })
  }, [])

  /* ── Animate slide IN ── */
  const animateIn = useCallback(() => {
    const el = slideRef.current
    if (!el) return
    const children = el.querySelectorAll("[data-s]")
    gsap.set(children, { y: 24, opacity: 0 })

    gsap.to(children, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      ease: "power2.out",
      stagger: 0.06,
      force3D: true,
      onComplete: () => { isAnimating.current = false },
    })
  }, [])

  /* ── Go to specific slide with transition ── */
  const goTo = useCallback((idx: number) => {
    if (isAnimating.current || idx === current) return
    if (idx < 0 || idx >= SLIDES.length) return
    isAnimating.current = true

    const el = slideRef.current
    if (!el) return
    const children = el.querySelectorAll("[data-s]")
    const dir = idx > current ? -1 : 1 // slide out up if next, down if prev

    gsap.to(children, {
      y: dir * 16,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.02,
      force3D: true,
      onComplete: () => setCurrent(idx),
    })
  }, [current])

  /* ── On slide change, animate in ── */
  useEffect(() => {
    animateIn()
  }, [current, animateIn])

  return (
    <div
      ref={pageRef}
      dir="rtl"
      lang="ar"
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden opacity-0"
      style={{ background: "#070710" }}
    >
      {/* Blobs */}
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[120px] opacity-25"
        style={{ width: 600, height: 600, background: `radial-gradient(circle,#7c3aed,transparent 70%)`, top: "-15%", left: "-8%", willChange: "transform" }} />
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[100px] opacity-15"
        style={{ width: 500, height: 500, background: `radial-gradient(circle,#db2777,transparent 70%)`, bottom: "-10%", right: "-5%", willChange: "transform" }} />


      {/* ── Step dots ── */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-violet-500"
                : i < current
                  ? "w-2 h-2 bg-violet-500/40"
                  : "w-2 h-2 bg-white/10"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Center content ── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-5 sm:px-10 flex flex-col items-center">
        <div
          ref={slideRef}
          className="flex flex-col items-center text-center min-h-[360px] sm:min-h-[400px] justify-center"
        >
          <SlideContent slide={SLIDES[current]} />
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {!isLast && (
        <div className="fixed bottom-8 inset-x-0 z-40 flex items-center justify-center gap-4">
          {/* Prev */}
          {!isFirst && (
            <button
              onClick={() => goTo(current - 1)}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/20 transition-colors duration-200"
              aria-label="السابق"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}

          {/* Next */}
          <button
            onClick={() => goTo(current + 1)}
            className="h-11 px-6 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium flex items-center gap-2 transition-colors duration-200"
            aria-label="التالي"
          >
            <span>التالي</span>
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Skip link ── */}
      {!isLast && (
        <button
          onClick={() => goTo(SLIDES.length - 1)}
          className="fixed bottom-8 left-6 z-40 text-white/15 hover:text-white/40 text-xs transition-colors duration-200 underline underline-offset-4"
          aria-label="تخطي إلى اختيار اللغة"
        >
          تخطي
        </button>
      )}
    </div>
  )
}

/* ── Helper: wraps each JSX child of a slide with data-s for GSAP stagger ── */
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
