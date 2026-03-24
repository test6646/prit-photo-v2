"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const images = [
  "/images/hero/1.png",
  "/images/hero/2.png",
  "/images/hero/3.png"
]

export default function AboutSection() {

  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const text =
    "Hi, we are PRIT PHOTO — a photography studio capturing authentic moments and meaningful stories through light, emotion, and timeless imagery. Our work focuses on honest cinematic photographs deeply connected to people and environments. From quiet portraits to vibrant celebrations, we preserve memories in a natural and lasting way."

  const chars = text.split("")

  useEffect(() => {

    const handleScroll = () => {

      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight

      const total = rect.height - vh
      const scrolled = Math.max(0, -rect.top)

      const p = Math.min(scrolled / total, 1)

      setProgress(p)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)

  }, [])

  return (

    <section
      ref={sectionRef}
      className="relative w-full px-[6vw] py-[30px] font-[blauer]"
      style={{
        minHeight: "500vh",
        background: "var(--background)"
      }}
    >

      {/* HEADER */}

      <div
        className="flex justify-between text-[11px] md:text-[15px] tracking-[0.25em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        <span>+ ABOUT US</span>
        <span>{`{01}`}</span>
      </div>


      {/* PINNED AREA */}

      <div className="sticky top-0 h-screen flex items-center">

        <div className="grid md:grid-cols-12 w-full max-w-[1400px] mx-auto">


          {/* TEXT */}

          <div className="md:col-span-7">

            <p
              className="text-[22px] md:text-[28px] font-light tracking-[-0.02em] leading-[1.45]"
              style={{ color: "var(--text)" }}
            >

              {chars.map((char, i) => {

                const threshold = i / chars.length
                const revealed = i === 0 || progress >= threshold

                return (

                  <span
                    key={i}
                    style={{
                      color: revealed ? "var(--text)" : "var(--border)",
                      minWidth: char === " " ? "0.35em" : "auto"
                    }}
                  >
                    {char}
                  </span>

                )

              })}

            </p>

          </div>


          {/* STACKING CARDS */}

          <div className="hidden md:block md:col-span-5 relative">

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[340px]">

              {images.map((src, i) => {

                const start = i * 0.25
                const end = start + 0.25

                let p = (progress - start) / (end - start)
                p = Math.max(0, Math.min(1, p))

                const y = 300 * (1 - p)
                const scale = 0.8 + p * 0.2
                const rotate = (i - 1) * 6
                const opacity = 0.4 + p * 0.6

                return (

                  <div
                    key={i}
                    className="absolute left-0 w-[300px] h-[400px] rounded-sm overflow-hidden shadow-2xl"
                    style={{
                      transform: `translate3d(0,${y}px,0) rotate(${rotate}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: 10 + i,
                    }}
                  >

                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="Prit Photo work"
                    />

                    {/* cinematic overlay */}

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(255, 255, 255, 0.5))"
                      }}
                    />

                  </div>

                )

              })}

            </div>

          </div>

        </div>

      </div>


      {/* MORE LINK */}

      <div className="absolute right-[6vw] bottom-[80px]">

        <Link
          href="/about"
          className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          • MORE ABOUT US
        </Link>

      </div>


      {/* DOT */}

      <div
        className="absolute right-[6vw] top-[80px] w-2 h-2 rounded-full"
        style={{ background: "var(--silver-soft)" }}
      />

    </section>

  )

}