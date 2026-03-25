"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function StoryPage() {
  const { slug } = useParams();
  const [story, setStory] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;

      const { data: storyData } = await supabase
        .from("stories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!storyData) {
        setError("Story not found");
        setLoading(false);
        return;
      }

      setStory(storyData);

      const { data: galleryData } = await supabase
        .from("story_images")
        .select("*")
        .eq("story_id", storyData.id)
        .order("order_index");

      setGallery(galleryData || []);
      setLoading(false);
    };

    fetchStory();
  }, [slug]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center font-[blauer]">
        <p className="text-xl text-[var(--text-muted)]">Loading story...</p>
      </section>
    );
  }

  if (error || !story) {
    return (
      <section className="min-h-screen flex items-center justify-center font-[blauer] px-[6vw]">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Story Not Found</h1>
          <Link href="/" className="text-[var(--text)] underline">← Back to Home</Link>
        </div>
      </section>
    );
  }

  const desktopGallery = gallery.filter((img) => img.type === "desktop");
  const mobileGallery = gallery.filter((img) => img.type === "mobile");

  return (
    <section className="relative w-full px-[6vw] font-[blauer]" style={{ background: "var(--background)" }}>
      <div className="max-w-[1180px] mx-auto">

        {/* Back Button */}
        <div className="flex justify-center m-10">
          <Link
            href="/"
            className="border border-[var(--border)] rounded-full hover:bg-[var(--text)] hover:text-[var(--background)] transition-all px-12 py-4 text-xs tracking-[0.2em] uppercase font-medium"
          >
            Home
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-20">
          <h1 className="text-[42px] md:text-[68px] font-light tracking-[-0.04em] leading-none">
            {story.title}
          </h1>
          <p className="mt-6 text-[var(--text-muted)] text-[17px]">
            {story.category} • {story.year}
          </p>
        </div>

        {/* ====================== DESKTOP CINEMATIC VIEW ====================== */}
        <div className="hidden md:block relative">
          <div className="relative aspect-[16/9] overflow-hidden shadow-2xl">

            {/* Main Large Image */}
            <img
              src={desktopGallery[activeIndex]?.image_url || story.desktop_main}
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
            />

            {/* Dark moody overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

            {/* Thumbnails Inside Bottom - Sharp Edges */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {desktopGallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-28 h-16 overflow-hidden border transition-all duration-300
                    ${activeIndex === index 
                      ? "border-white" 
                      : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img.image_url}
                    alt={`Thumb ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ====================== MOBILE VIEW ====================== */}
        <div className="md:hidden space-y-12">
          <div className="overflow-hidden shadow-2xl">
            <img
              src={story.mobile_main}
              alt={story.title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-10">
            {mobileGallery.map((img, i) => (
              <div key={i} className="overflow-hidden shadow-2xl">
                <img
                  src={img.image_url}
                  alt={`${story.title} ${i + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}