"use client"

import { useState, useRef } from "react"

const testimonials = [
  {
    name: "Aarav Patel",
    role: "Wedding Client",
    image: "/images/testimonials/1.png",
    text: `PRIT PHOTO captured our wedding day with incredible care.
Every glance, every laugh and every quiet moment was preserved beautifully.
Looking through the photographs feels like reliving the day all over again.`
  },
  {
    name: "Neha Shah",
    role: "Creative Director",
    image: "/images/testimonials/2.png",
    text: `Working with PRIT PHOTO was a remarkable experience.
Their ability to observe emotion and light creates photographs
that feel cinematic yet deeply personal.`
  },
  {
    name: "Rohan Mehta",
    role: "Brand Founder",
    image: "/images/testimonials/3.png",
    text: `The photographs feel timeless and honest.
PRIT PHOTO has an incredible eye for composition
and the patience to capture real moments.`
  },
  {
    name: "Isha Desai",
    role: "Portrait Client",
    image: "/images/testimonials/4.png",
    text: `Every frame feels natural and effortless.
The atmosphere during the shoot was calm and inspiring,
which truly reflects in the final images.`
  },
  {
    name: "Kabir Sharma",
    role: "Wedding Planner",
    image: "/images/testimonials/5.png",
    text: `PRIT PHOTO understands storytelling.
Their images capture emotion, movement and atmosphere
in a way that few photographers can achieve.`
  }
]

export default function Testimonials() {

  const [active, setActive] = useState(0)

  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const lines = testimonials[active].text.split("\n")

  /* TOUCH SWIPE */

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {

    const diff = e.touches[0].clientX - startX.current

    if (cardRef.current) {
      cardRef.current.style.transform = `rotateY(${diff * 0.08}deg)`
    }

  }

  const handleTouchEnd = (e: React.TouchEvent) => {

    const diff = e.changedTouches[0].clientX - startX.current

    if (Math.abs(diff) > 60) {

      if (diff < 0) {
        setActive((prev) => (prev + 1) % testimonials.length)
      } else {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      }

    }

    if (cardRef.current) {
      cardRef.current.style.transform = `rotateY(0deg)`
    }

  }

  return (

    <section 
    id="testimonials"
    className="relative w-full px-[6vw] py-[160px] font-[blauer]">

      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}


        {/* TITLE */}

        <div className="text-center mb-[30px]">

          <h2 className="text-[30px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05]">
            WHAT OUR CLIENTS SAY
          </h2>

          <p
            className="mt-4 text-[14px] md:text-[16px] max-w-[420px] mx-auto leading-[1.6]"
            style={{ color: "var(--text-muted)" }}
          >
            A few words from the people who trusted us to capture their special moments.
          </p>

        </div>


        {/* MAIN CARD */}

        <div
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[420px] md:h-[575px] overflow-hidden rounded-sm"
          style={{ perspective: "1200px" }}
        >

          {/* IMAGE */}

          <img
            key={active}
            src={testimonials[active].image}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-out"
          />


          {/* GRADIENT */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />


          {/* TEXT */}

          <div className="absolute left-[20px] md:left-[40px] top-[20px] md:top-[40px] max-w-[85%] md:max-w-[520px]">

            <span className="text-[10px] md:text-[15px] tracking-[0.25em] text-[var(--text-muted)]">

              {`{0${active + 1}}`}

            </span>


            <div className="mt-4 md:mt-6 text-[16px] md:text-[24px] leading-[1.5]">

              {lines.map((line, i) => (

                <p key={i}>{line}</p>

              ))}

            </div>


            <div className="mt-4 md:mt-6 text-[10px] md:text-[15px] text-[var(--text-muted)] uppercase tracking-[0.25em]">

              — {testimonials[active].name}, {testimonials[active].role}

            </div>

          </div>


          {/* THUMBNAILS (DESKTOP ONLY) */}

          <div className="absolute bottom-[24px] left-[40px] hidden md:flex gap-3">

            {testimonials.map((item, i) => (

              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className="w-[70px] h-[50px] overflow-hidden cursor-pointer"
              >

                <img
                  src={item.image}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-40"}`}
                />

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  )
}