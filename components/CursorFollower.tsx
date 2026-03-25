"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect } from "react"

export default function CursorFollower() {

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    /* Spring smoothing */
    const springConfig = { damping: 25, stiffness: 200 }

    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    useEffect(() => {

        const move = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        window.addEventListener("mousemove", move)

        return () => window.removeEventListener("mousemove", move)

    }, [mouseX, mouseY])

    return (
        <div className="follower hidden md:block">

            <motion.div
                style={{
                    translateX: x,
                    translateY: y
                }}
                className="
      pointer-events-none
      fixed top-0 left-0
      w-[12px] h-[12px]
      rounded-full
      bg-[var(--silver-soft)]
      -translate-x-1/2 -translate-y-1/2
      z-[9999]
      mix-blend-difference
      "
            />

            <motion.div
                style={{
                    translateX: x,
                    translateY: y
                }}
                className="
      pointer-events-none
      fixed top-0 left-0
      w-[30px] h-[30px]
      rounded-full
      border-2 border-[var(--silver-soft)]
      -translate-x-1/2 -translate-y-1/2
      z-[9999]
      mix-blend-difference
      "
            />

        </div>

    )

}
