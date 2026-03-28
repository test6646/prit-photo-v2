"use client"

import React, { useEffect, useRef, useState } from "react"

const images = [
    "/images/hero/1.png",
    "/images/hero/2.png",
    "/images/hero/3.png",
    "/images/hero/4.png",
]

const CONFIG = [
    { depth: 420, baseRot: -24, spin: 40, dirX: 1.1, dirY: -0.3, z: 24 },
    { depth: 260, baseRot: 10, spin: 28, dirX: 0.7, dirY: 0.2, z: 23 },
    { depth: 160, baseRot: 16, spin: 20, dirX: -0.6, dirY: -0.2, z: 22 },
    { depth: 80, baseRot: -8, spin: 12, dirX: 1.0, dirY: 0.1, z: 21 },
]

const WIGGLE = [
    { ampX: 18, ampY: 8, ampRot: 6, freqX: 0.7, freqY: 0.5, phaseX: 0, phaseY: 1.2 },
    { ampX: 12, ampY: 6, ampRot: 4, freqX: 0.5, freqY: 0.8, phaseX: 2.1, phaseY: 0.4 },
    { ampX: 10, ampY: 9, ampRot: 5, freqX: 0.9, freqY: 0.6, phaseX: 1.0, phaseY: 2.5 },
    { ampX: 14, ampY: 5, ampRot: 3, freqX: 0.6, freqY: 0.7, phaseX: 3.0, phaseY: 0.9 },
]

export default function Landing() {

    const containerRef = useRef<HTMLDivElement>(null)
    const mobileImgRefs = useRef<(HTMLImageElement | null)[]>([])
    const desktopImgRefs = useRef<(HTMLImageElement | null)[]>([])
    const mouse = useRef({ x: 0, y: 0 })
    const target = useRef({ x: 0, y: 0 })
    const raf = useRef<number | null>(null)
    const isMobile = useRef(false)

    const [time, setTime] = useState("")

    // Initialize ref arrays once (prevents any index issues)
    useEffect(() => {
        mobileImgRefs.current = new Array(4).fill(null)
        desktopImgRefs.current = new Array(4).fill(null)
    }, [])

    // Time (unchanged)
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        }
        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const checkMobile = () => {
            isMobile.current = window.innerWidth < 768
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)

        const handleMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouse.current.x = (e.clientX - rect.left) / rect.width - 0.5
            mouse.current.y = (e.clientY - rect.top) / rect.height - 0.5
        }

        container.addEventListener("mousemove", handleMove)

        const animate = () => {
            const t = performance.now() / 1000

            // Use the correct set of images (mobile or desktop) — this was the main jank source
            const currentRefs = isMobile.current ? mobileImgRefs.current : desktopImgRefs.current

            if (isMobile.current) {
                currentRefs.forEach((img, i) => {
                    if (!img) return
                    const w = WIGGLE[i]
                    const cfg = CONFIG[i]

                    const moveX = Math.sin(t * w.freqX + w.phaseX) * w.ampX
                    const moveY = Math.cos(t * w.freqY + w.phaseY) * w.ampY
                    const rotation = cfg.baseRot + Math.sin(t * 0.4 + i) * w.ampRot

                    img.style.transform =
                        `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotation}deg)`
                })
            } else {
                target.current.x += (mouse.current.x - target.current.x) * 0.14
                target.current.y += (mouse.current.y - target.current.y) * 0.05

                currentRefs.forEach((img, i) => {
                    if (!img) return
                    const cfg = CONFIG[i]

                    const moveX = target.current.x * cfg.depth * cfg.dirX
                    const moveY = target.current.y * (cfg.depth * 0.06) * cfg.dirY
                    const rotation = cfg.baseRot + target.current.x * cfg.spin
                    const stretch = 1 + Math.min(Math.abs(target.current.x) * 0.18, 0.22)

                    img.style.transform =
                        `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotation}deg) scale(${stretch})`
                })
            }

            raf.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            container.removeEventListener("mousemove", handleMove)
            window.removeEventListener("resize", checkMobile)
            if (raf.current) cancelAnimationFrame(raf.current)
        }
    }, [])

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative px-1 md:px-[6vw] py-20 md:py-[200px] [font-family:blauer] overflow-hidden flex flex-col items-center justify-center bg-[var(--background)] font-[blauer]"
        >

            {/* LOCATION + TIME */}
            <div
                className="absolute top-6 border-1 p-2 rounded-full left-1/2 -translate-x-1/2 text-[11px] md:text-[11px] tracking-[0.25em] uppercase whitespace-nowrap z-30 text-[var(--text-muted)]"
            >
                AHMEDABAD • <span className="font-bold text-[var(--text)]">{time}</span>
            </div>


            {/* MOBILE LAYOUT */}

            <div className="flex md:hidden flex-col items-center justify-center w-full h-full px-[6vw] gap-6">

                {/* RANDOM IMAGES */}
                <div className="relative w-full h-[15vh]">

                    {images.map((src, i) => (

                        <img
                            key={i}
                            ref={el => { mobileImgRefs.current[i] = el }}
                            src={src}
                            className="absolute w-[80px] h-[100px] object-cover rounded-[3px] shadow-2xl will-change-transform"
                            style={{
                                top: ["10%", "60%", "35%", "70%"][i],
                                left: ["20%", "70%", "50%", "10%"][i],
                                transform: `rotate(${CONFIG[i].baseRot}deg)`,
                                zIndex: CONFIG[i].z,
                                backfaceVisibility: "hidden",
                            }}
                        />

                    ))}

                </div>


                {/* HERO TEXT */}

                <div
                    className="z-30 text-center pointer-events-none select-none"
                    style={{ mixBlendMode: "difference" }}
                >
                    <h1 className="text-[16vw] leading-[0.85] uppercase text-[var(--text)]">PRIT</h1>
                    <h1 className="text-[16vw] leading-[0.85] uppercase text-[var(--text)]">PHOTO</h1>
                </div>


                {/* DESCRIPTION */}

                <p
                    className="text-[15px] md:text-[10vh] leading-[1.3] text-center text-[var(--text-muted)] max-w-[320px]"
                >
                    We capture fleeting moments and turn them into timeless memories —
                    from intimate portraits to unforgettable weddings.
                </p>


                {/* CONTACT ICONS */}

                <div className="flex justify-center md:justify-end gap-3 pt-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor">
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
                  </svg>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a 
                  href="mailto:hello@pritphoto.com"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
              </div>


                {/* STAMP */}

                <div className="flex items-center justify-center">

                    <div className="relative w-[110px] h-[110px] flex items-center justify-center">

                        <svg viewBox="0 0 200 200" className="absolute w-full h-full animate-spin-slow">

                            <defs>
                                <path
                                    id="circlePath-m"
                                    d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                                />
                            </defs>

                            <text fill="var(--text)" fontSize="12" letterSpacing="5">
                                <textPath href="#circlePath-m">
                                    EXPLORE OUR WORK • EXPLORE OUR WORK •
                                </textPath>
                            </text>

                        </svg>

                        <button
                            className="w-10 h-10 rounded-full bg-[var(--text)] text-[var(--background)] flex items-center justify-center text-base hover:scale-110 transition-transform duration-300"
                        >
                            ↓
                        </button>

                    </div>

                </div>

            </div>


            {/* DESKTOP LAYOUT — UNCHANGED */}

            <div
                className="hidden md:block absolute pointer-events-none flex items-center"
                style={{ left: "60vw", top: "26vh", width: "240px", height: "320px" }}
            >

                {images.map((src, i) => (

                    <img
                        key={i}
                        ref={el => { desktopImgRefs.current[i] = el }}
                        src={src}
                        className="absolute inset-0 w-full h-full object-cover rounded-[3px] shadow-2xl will-change-transform"
                        style={{
                            transform: `rotate(${CONFIG[i].baseRot}deg)`,
                            zIndex: CONFIG[i].z,
                            backfaceVisibility: "hidden",
                        }}
                    />

                ))}

            </div>


            <div
                className="hidden md:block z-30 text-center pointer-events-none select-none"
                style={{ mixBlendMode: "difference" }}
            >

                <h1 className="text-[8.5vw] leading-[0.85] uppercase font-bold text-[var(--text)]">PRIT</h1>
                <h1 className="text-[8.5vw] leading-[0.85] uppercase font-bold text-[var(--text)]">PHOTO</h1>

            </div>


            <p
                className="hidden md:block absolute top-25 text-[14px] md:text-[21px] leading-relaxed text-[var(--text-muted)]"
                style={{ bottom: "50vh", left: "15vw", maxWidth: "240px" }}
            >
                We capture fleeting moments and turn them into timeless memories —
                from intimate portraits to unforgettable weddings.
            </p>


            {/* CONTACT ICONS */}

            <div className="absolute md:flex hidden right-[30vh] top-[10vh] flex justify-center md:justify-end gap-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor">
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
                  </svg>
                </a>

                <a 
                  href="https://youtube.com" 
                  target="_blank"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a 
                  href="mailto:hello@pritphoto.com"
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                  </svg>
                </a>
              </div>


            <div
                className="hidden md:flex absolute items-center justify-center"
                style={{ bottom: "5vh", left: "20vw" }}
            >

                <div className="relative w-[180px] h-[180px] flex items-center justify-center">

                    <svg viewBox="0 0 200 200" className="absolute w-full h-full animate-spin-slow">

                        <defs>
                            <path
                                id="circlePath"
                                d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                            />
                        </defs>

                        <text fill="var(--text)" fontSize="12" letterSpacing="5">
                            <textPath href="#circlePath">
                                EXPLORE OUR WORK • EXPLORE OUR WORK • 
                            </textPath>
                        </text>

                    </svg>

                    <button
                        className="w-16 h-16 rounded-full bg-[var(--text)] text-[var(--background)] flex items-center justify-center text-xl hover:scale-110 transition-transform duration-300"
                    >
                        ↓
                    </button>

                </div>

            </div>

        </section>
    )
}