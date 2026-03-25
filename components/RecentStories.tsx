"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function RecentStories() {
  const [stories, setStories] = useState<any[]>([])
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error) setStories(data || [])
    }

    fetchStories()
  }, [])

  return (
    <section
      id="stories"
      className="relative w-full px-[6vw] py-[160px] font-[blauer]"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-[30px]">
          <h2
            className="text-[42px] md:text-[64px] font-light tracking-[-0.03em]"
            style={{ color: "var(--text)" }}
          >
            RECENT STORIES
          </h2>

          <p
            className="mt-6 text-[15px] md:text-[16px] max-w-[420px] mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            A few highlights from the people, places and moments I've been lucky enough to capture.
          </p>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-12 gap-8">
          {stories.map((story, i) => {
            const isHovered = hover === i

            return (
              <Link
                href={`/stories/${story.slug}`}
                key={story.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="col-span-6 group"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-black">
                  {/* Main Image */}
                  <img
                    src={story.desktop_main}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out
                      ${isHovered ? "brightness-[0.85]" : "brightness-100"}
                    `}
                  />

                  {/* Slight Blackish Backdrop Overlay */}
                  <div
                    className={`absolute inset-0 bg-black transition-all duration-700 ease-out
                      ${isHovered ? "opacity-40" : "opacity-0"}
                    `}
                  />

                  {/* Hover Popup Image - Clean Center Pop (from scale 0) */}
                  <img
                    src={story.desktop_hover}
                    className={`absolute left-1/2 top-1/2 w-[333px] rounded-sm -translate-x-1/2 -translate-y-1/2
                      transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                      ${isHovered
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-0"
                      }`}
                  />
                </div>

                {/* Content */}
                <div className="mt-4">
                  <div
                    className="flex justify-between text-[11px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>{story.category}</span>
                    <span>{story.year}</span>
                  </div>

                  <p
                    className="text-[15px] mt-1 transition-colors duration-200 group-hover:text-[var(--accent)]"
                    style={{ color: "var(--text)" }}
                  >
                    {story.title}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* MOBILE - unchanged */}
        <div className="md:hidden space-y-10">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-sm">
                <img
                  src={story.mobile_main}
                  className="w-full aspect-[4/5] object-cover transition-all duration-300 group-hover:scale-[1.02]"
                />
                <div 
                  className={`absolute inset-0 border-2 border-[var(--text)]/50 rounded-sm transition-all duration-300`}
                />
              </div>

              <div className="mt-3">
                <div
                  className="flex justify-between text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span>{story.category}</span>
                  <span>{story.year}</span>
                </div>

                <p
                  className="text-[15px] mt-1 transition-colors duration-200 group-hover:text-[var(--accent)]"
                  style={{ color: "var(--text)" }}
                >
                  {story.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}