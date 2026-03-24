"use client"

import { useState } from "react"

const services = [
  {
    title: "WEDDINGS",
    image: "/images/services/wedding.png",
    items: [
      "Full day wedding coverage",
      "Candid & documentary photography",
      "Traditional ceremony coverage",
      "Destination weddings"
    ]
  },
  {
    title: "PRE-WEDDINGS",
    image: "/images/services/prewedding.png",
    items: [
      "Outdoor cinematic pre-wedding shoots",
      "Destination pre-wedding sessions",
      "Creative storytelling concepts",
      "Styled couple photography"
    ]
  },
  {
    title: "ENGAGEMENTS",
    image: "/images/services/engagement.png",
    items: [
      "Engagement ceremony coverage",
      "Couple portrait sessions",
      "Family celebration moments",
      "Short engagement highlight films"
    ]
  },
  {
    title: "MATERNITY SHOOTS",
    image: "/images/services/maternity.png",
    items: [
      "Studio maternity portraits",
      "Outdoor maternity storytelling",
      "Couple maternity sessions",
      "Lifestyle motherhood photography"
    ]
  },
  {
    title: "CORPORATE SHOOTS",
    image: "/images/services/corporate.png",
    items: [
      "Corporate events & conferences",
      "Professional headshots",
      "Brand & marketing photography",
      "Business storytelling visuals"
    ]
  },
  {
    title: "OTHERS",
    image: "/images/services/others.png",
    items: [
      "Birthday & celebration shoots",
      "Family portraits",
      "Fashion & editorial photography",
      "Custom photography requests"
    ]
  }
]

const getRotation = (index: number) => {
  const angles = [5, -6, 4, -5, 7, -4]
  return angles[index % angles.length]
}

export default function Services() {

  const [active, setActive] = useState<number | null>(null)

  return (

    <section
      className="relative w-full px-6 md:px-[6vw] py-20 md:py-[160px] [font-family:blauer]"
      style={{ background: "var(--background)" }}
    >

      {/* HEADER */}

      <div
        className="flex justify-between mb-16 md:mb-[80px] text-[11px] md:text-[15px] tracking-[0.25em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        <span>+ SERVICES</span>
        <span>{`{03}`}</span>
      </div>


      {/* SERVICES LIST */}

      <div className="space-y-16 md:space-y-[110px]">

        {services.map((service, index) => {

          const rotation = getRotation(index)
          const isActive = active === index

          return (

            <div
              key={index}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className="group relative grid grid-cols-1 md:grid-cols-[220px_180px_1fr] lg:grid-cols-[240px_200px_1fr] gap-x-8 md:gap-x-12 gap-y-8 items-start"
            >

              {/* TITLE */}

              <div className="flex items-center gap-3 md:gap-4">

                <span
                  className="text-base md:text-lg font-mono shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  {`{0${index + 1}}`}
                </span>

                <h3
                  className="text-[24px] md:text-[30px] lg:text-[32px] font-light tracking-[-0.02em] leading-none"
                  style={{ color: "var(--text)" }}
                >
                  {service.title}
                </h3>

              </div>


              {/* IMAGE */}

              <div className="relative w-[120px] md:w-[130px] lg:w-[140px] h-[160px] md:h-[170px] lg:h-[180px] ml-6 md:ml-10 lg:ml-12">

                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-xl transition-transform duration-[300ms] ease-out"
                  style={{
                    border: "1px solid var(--border)",
                    transform: isActive
                      ? `rotate(${-rotation}deg)`
                      : `rotate(${rotation}deg)`
                  }}
                />

              </div>


              {/* BULLET LIST */}

              <div
                className="text-[14px] md:text-[15px] leading-[1.55] pt-1 md:pt-2"
                style={{ color: "var(--text-muted)" }}
              >

                {service.items.map((item, i) => (

                  <div key={i} className="flex gap-3 mb-2">

                    <span style={{ color: "var(--silver-soft)" }}>+</span>

                    <span>{item}</span>

                  </div>

                ))}

              </div>


              {/* DOT */}

              <div
                className="absolute right-6 md:right-[6vw] top-6 md:top-8 w-2 h-2 rounded-full"
                style={{ background: "var(--silver-soft)" }}
              />

            </div>

          )

        })}

      </div>

    </section>

  )

}