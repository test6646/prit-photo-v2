"use client"

import { useState } from "react"

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

  const lines = testimonials[active].text.split("\n")

  return (

    <section className="relative w-full px-[6vw] py-[160px] font-[blauer]">

      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}

        <div className="flex justify-between mb-[80px] text-[11px] md:text-[15px] tracking-[0.25em] uppercase text-white/60">
          <span>+ TESTIMONIALS</span>
          <span>{`{04}`}</span>
        </div>


        {/* TITLE */}

        <div className="text-center mb-[30px] max-w-[1400px] mx-auto">

          <h2 className="text-[42px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05]">
            WHAT MY CLIENTS SAY
          </h2>

          <p className="mt-6 text-[15px] md:text-[16px] max-w-[420px] mx-auto leading-[1.6]"
            style={{ color: "var(--text-muted)" }}>
            Words that mean the world
          </p>

        </div>


        {/* MAIN CARD */}

        <div className="relative w-full h-[575px] overflow-hidden rounded-sm">

          {/* IMAGE */}

          <img
            key={active}
            src={testimonials[active].image}
            className="
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[900ms] ease-out
            "
          />

          {/* GRADIENT */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />


          {/* TEXT */}

          <div className="absolute left-[40px] top-[40px] max-w-[520px]">

            <span className="text-[11px] md:text-[15px] tracking-[0.25em] text-[var(--text-muted)]">

              {`{0${active + 1}}`}

            </span>


            <div className="mt-6 text-[20px] md:text-[24px] leading-[1.5]">

              {lines.map((line, i) => (

                <p
                  key={i}
                  className="testimonial-line"
                  style={{ animationDelay: `${i * 0.18}s` }}
                >
                  {line}
                </p>

              ))}

            </div>


            <div className="mt-6 text-[11px] md:text-[15px] text-[var(--text-muted)] uppercase tracking-[0.25em]">

              — {testimonials[active].name}, {testimonials[active].role}

            </div>

          </div>


          {/* THUMBNAILS */}

          <div className="absolute bottom-[24px] left-[40px] flex gap-3">

            {testimonials.map((item, i) => (

              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className="w-[70px] h-[50px] overflow-hidden cursor-pointer"
              >

                <img
                  src={item.image}
                  className={`
                  w-full h-full object-cover
                  transition-opacity duration-500 ease-out
                  ${active === i ? "opacity-100" : "opacity-40"}
                  `}
                />

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  )
}