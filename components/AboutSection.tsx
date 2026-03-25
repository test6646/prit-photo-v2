"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"

const images = [
  "/images/hero/1.png",
  "/images/hero/2.png",
  "/images/hero/3.png",
]

export default function AboutSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const rafRef      = useRef<number | null>(null)
  const tickingRef  = useRef(false)

  // ─── Detect Next.js soft-navigation back to "/" ──────────────────────────
  // usePathname() changes on every client-side route change, so we use it as
  // the trigger to re-initialise scroll state instead of relying on unreliable
  // pageshow / visibilitychange events.
  const pathname = usePathname()

  const text =
    "Hi, we are PRIT PHOTO — a photography studio capturing authentic moments and meaningful stories through light, emotion, and timeless imagery. Our work focuses on honest cinematic photographs deeply connected to people and environments. From quiet portraits to vibrant celebrations, we preserve memories in a natural and lasting way."

  const chars = text.split("")

  // ─── Core scroll calculator ───────────────────────────────────────────────
  const calculateProgress = useCallback(() => {
    if (!sectionRef.current) return

    const rect   = sectionRef.current.getBoundingClientRect()
    const vh     = window.innerHeight
    const total  = rect.height - vh * 0.35
    const scrolled = Math.max(0, -rect.top)
    const p      = Math.min(scrolled / total, 1)

    setProgress(p)
    tickingRef.current = false
  }, [])

  // ─── Scroll listener (rAF-throttled) ────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (tickingRef.current) return
    tickingRef.current = true
    rafRef.current = requestAnimationFrame(calculateProgress)
  }, [calculateProgress])

  // ─── Mount / unmount scroll listener ────────────────────────────────────
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    calculateProgress() // set initial value without waiting for a scroll

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [handleScroll, calculateProgress])

  // ─── Re-initialise whenever the route returns to this page ───────────────
  // This covers:
  //   • Next.js Link navigation back to "/" (pathname changes)
  //   • Browser back button after a bfcache restore
  //   • Tab becoming visible again
  useEffect(() => {
    // Cancel any in-flight frame to avoid stale reads
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    tickingRef.current = false

    // Give the DOM one frame to settle (scroll position is restored by
    // the browser/Next.js before paint, so a single rAF is enough).
    rafRef.current = requestAnimationFrame(calculateProgress)
  }, [pathname, calculateProgress])

  // ─── bfcache: browser hard-back (full page restore from cache) ───────────
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        tickingRef.current = false
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(calculateProgress)
      }
    }

    // visibilitychange covers tab switching / Android "back to tab"
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        tickingRef.current = false
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(calculateProgress)
      }
    }

    window.addEventListener("pageshow", onPageShow)
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [calculateProgress])

  // ─── Revealed text ───────────────────────────────────────────────────────
  const revealedText = useMemo(() => {
    const revealProgress  = Math.min(progress / 0.72, 1)
    const revealedLength  = Math.floor(revealProgress * chars.length)

    return (
      <>
        <span style={{ color: "var(--text)", transition: "color 0.08s linear" }}>
          {text.slice(0, revealedLength)}
        </span>
        <span style={{ color: "var(--border)" }}>
          {text.slice(revealedLength)}
        </span>
      </>
    )
  }, [progress, text, chars.length])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full px-[6vw] py-[160px] font-[blauer]"
      style={{ minHeight: "340vh", background: "var(--background)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-[120px]">
          <h2
            className="text-[42px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05]"
            style={{ color: "var(--text)" }}
          >
            ABOUT US
          </h2>
          <p
            className="mt-6 text-[15px] md:text-[16px] max-w-[420px] mx-auto leading-[1.6]"
            style={{ color: "var(--text-muted)" }}
          >
            A studio dedicated to documenting authentic emotions, timeless stories, and cinematic moments.
          </p>
        </div>
      </div>

      {/* ── PINNED AREA ──────────────────────────────────────────────── */}
      <div className="sticky top-60 h-[40vh] flex items-center">
        <div className="grid md:grid-cols-12 w-full mx-auto relative">

          {/* TEXT */}
          <div className="md:col-span-7 relative z-1">
            <p
              className="text-[22px] md:text-[28px] font-light tracking-[-0.02em] leading-[1.45]"
              style={{ color: "var(--text)" }}
            >
              {revealedText}
            </p>
          </div>

          {/* MOBILE IMAGES */}
          <div className="md:hidden absolute inset-0 pointer-events-none overflow-hidden">
            {images.map((src, i) => {
              let x = 0, y = 0, scale = 1, opacity = 1

              if (i === 0) {
                x = -progress * 280
                scale   = 1 - progress * 0.35
                opacity = 1 - progress * 1.1
              } else if (i === 1) {
                x = progress * 280
                scale   = 1 - progress * 0.35
                opacity = 1 - progress * 1.1
              } else {
                y = -progress * 220
                scale   = 0.95 + progress * 0.15
                opacity = 1 - progress * 1.4
              }

              return (
                <div
                  key={i}
                  className="absolute w-[168px] h-[225px] rounded-sm overflow-hidden shadow-2xl"
                  style={{
                    left:      i === 0 ? "6%" : i === 1 ? "52%" : "31%",
                    top:       i === 0 ? "24%" : i === 1 ? "31%" : "58%",
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
                    opacity,
                    zIndex:    5 - i,
                    willChange: "transform, opacity",
                  }}
                >
                  <img src={src} className="w-full h-full object-cover" alt="" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 42%, rgba(255,255,255,0.38))",
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* DESKTOP STACK */}
          <div className="hidden md:block md:col-span-5 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[340px]">
              {images.map((src, i) => {
                const start = i * 0.22
                const end   = start + 0.34
                let p = (progress - start) / (end - start)
                p = Math.max(0, Math.min(1, p))

                const y       = 340 * (1 - p)
                const scale   = 0.76 + p * 0.26
                const rotate  = (i - 1) * 7
                const opacity = 0.32 + p * 0.68

                return (
                  <div
                    key={i}
                    className="absolute left-0 w-[290px] h-[390px] rounded-sm overflow-hidden shadow-2xl"
                    style={{
                      transform:  `translate3d(0,${y}px,0) rotate(${rotate}deg) scale(${scale})`,
                      opacity,
                      zIndex:     10 + i,
                      willChange: "transform, opacity",
                    }}
                  >
                    <img src={src} className="w-full h-full object-cover" alt="" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.5))",
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}