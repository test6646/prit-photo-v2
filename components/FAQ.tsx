"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "HOW SOON WILL I GET MY PHOTOS?",
    answer:
      "Wedding galleries are usually delivered within 3–4 weeks. Pre-wedding and smaller sessions are delivered within 7–10 days."
  },
  {
    question: "DO YOU TRAVEL FOR SHOOTS?",
    answer:
      "Yes, we love destination weddings and travel frequently for shoots across cities and locations."
  },
  {
    question: "HOW MANY PHOTOS WILL I GET?",
    answer:
      "For weddings you can expect around 400–700 carefully edited images depending on the coverage."
  },
  {
    question: "DO YOU RETOUCH THE PHOTOS?",
    answer:
      "Yes. All final photos are professionally color graded and lightly retouched to maintain a natural cinematic look."
  },
  {
    question: "HOW DO I BOOK A SESSION?",
    answer:
      "You can book a session by contacting us through our website or Instagram. A small advance confirms your booking."
  }
]

export default function FAQ() {

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (

    <section
      id="faqs"
      className="relative w-full px-[6vw] py-[160px] font-[blauer]"
      style={{ background: "var(--background)" }}
    >

      {/* TITLE */}

      <div className="text-center mb-[30px] max-w-[1400px] mx-auto">

        <h2
          className="text-[42px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05]"
          style={{ color: "var(--text)" }}
        >
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <p
          className="mt-6 text-[15px] md:text-[16px] max-w-[420px] mx-auto leading-[1.6]"
          style={{ color: "var(--text-muted)" }}
        >
          Here are some quick answers. If you have other questions,
          just reach out — I'd love to help.
        </p>

      </div>

      {/* FAQ LIST */}

      <div className="max-w-[720px] mx-auto">

        {faqs.map((faq, index) => {

          const open = openIndex === index

          return (

            <div
              key={index}
              className="border-b py-[22px]"
              style={{ borderColor: "var(--border)" }}
            >

              {/* QUESTION */}

              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between text-left"
              >

                <span
                  className="text-[15px] md:text-[16px] tracking-[0.02em]"
                  style={{ color: "var(--text)" }}
                >
                  {faq.question}
                </span>

                {/* PLUS ICON */}

                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[22px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  +
                </motion.span>

              </button>

              {/* ANSWER */}

              <AnimatePresence initial={false}>

                {open && (

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeInOut"
                    }}
                    className="overflow-hidden"
                  >

                    <p
                      className="pt-4 text-[14px] leading-[1.6]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {faq.answer}
                    </p>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          )

        })}

      </div>

    </section>

  )

}