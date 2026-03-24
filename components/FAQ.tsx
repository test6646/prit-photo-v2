"use client"

import { useState } from "react"

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

const toggle = (index:number) => {
setOpenIndex(openIndex === index ? null : index)
}

return (

<section
  className="relative w-full px-[6vw] py-[160px] font-[blauer]"
  style={{ background:"var(--background)" }}
>

  {/* HEADER */}

  <div
    className="flex justify-between mb-[80px] text-[11px] md:text-[15px] tracking-[0.25em] uppercase max-w-[1400px] mx-auto"
    style={{ color:"var(--text-muted)" }}
  >
    <span>+ FAQ</span>
    <span>{`{06}`}</span>
  </div>


  {/* TITLE */}

  <div className="text-center mb-[30px] max-w-[1400px] mx-auto">

    <h2
      className="text-[42px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05]"
      style={{ color:"var(--text)" }}
    >
      FREQUENTLY ASKED
      <br />
      QUESTIONS
    </h2>

    <p
      className="mt-6 text-[15px] md:text-[16px] max-w-[420px] mx-auto leading-[1.6]"
      style={{ color:"var(--text-muted)" }}
    >
      Here are some quick answers. If you have other questions,
      just reach out — I'd love to help.
    </p>

  </div>


  {/* FAQ LIST */}

  <div className="max-w-[1400px] mx-auto">

    <div className="max-w-[720px] mx-auto">

      {faqs.map((faq,index)=>{

        const open = openIndex === index

        return(

          <div
            key={index}
            className="border-b py-[22px]"
            style={{ borderColor:"var(--border)" }}
          >

            {/* QUESTION */}

            <button
              onClick={()=>toggle(index)}
              className="w-full flex items-center justify-between text-left"
            >

              <span
                className="text-[15px] md:text-[16px] tracking-[0.02em]"
                style={{ color:"var(--text)" }}
              >
                {faq.question}
              </span>

              {/* PLUS ICON */}

              <span
                className="text-[22px] transition-transform duration-300"
                style={{
                  transform: open ? "rotate(45deg)" : "rotate(0deg)",
                  color:"var(--text-muted)"
                }}
              >
                +
              </span>

            </button>


            {/* ANSWER */}

            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: open ? "200px" : "0px"
              }}
            >

              <p
                className="pt-4 text-[14px] leading-[1.6]"
                style={{ color:"var(--text-muted)" }}
              >
                {faq.answer}
              </p>

            </div>

          </div>

        )

      })}

    </div>

  </div>

</section>

)

}