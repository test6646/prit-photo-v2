"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

export default function AdminPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [activeTab, setActiveTab] = useState<"publish" | "manage">("publish");

  // Publish states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [year, setYear] = useState("");
  const [desktopMain, setDesktopMain] = useState<File | null>(null);
  const [desktopHover, setDesktopHover] = useState<File | null>(null);
  const [mobileMain, setMobileMain] = useState<File | null>(null);
  const [galleryDesktop, setGalleryDesktop] = useState<File[]>([]);
  const [galleryMobile, setGalleryMobile] = useState<File[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Manage states
  const [stories, setStories] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit states
  const [editingStory, setEditingStory] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editYear, setEditYear] = useState("");

  const [currentDesktopMainUrl, setCurrentDesktopMainUrl] = useState("");
  const [currentDesktopHoverUrl, setCurrentDesktopHoverUrl] = useState("");
  const [currentMobileMainUrl, setCurrentMobileMainUrl] = useState("");

  const [newDesktopMainFile, setNewDesktopMainFile] = useState<File | null>(null);
  const [newDesktopHoverFile, setNewDesktopHoverFile] = useState<File | null>(null);
  const [newMobileMainFile, setNewMobileMainFile] = useState<File | null>(null);

  const [editGalleryImages, setEditGalleryImages] = useState<any[]>([]);
  const [newGalleryDesktopFiles, setNewGalleryDesktopFiles] = useState<File[]>([]);
  const [newGalleryMobileFiles, setNewGalleryMobileFiles] = useState<File[]>([]);

  // Add this inside your AdminPage component, before the final return
  const CustomCategoryInput = ({
    onAdd,
    onCancel
  }: {
    onAdd: (category: string) => void;
    onCancel: () => void;
  }) => {
    const [customInput, setCustomInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = customInput.trim();
      if (trimmed) {
        onAdd(trimmed);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="e.g. Birthday, Fashion, Corporate..."
          className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px]"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 border border-[var(--border)] rounded-2xl text-sm font-medium hover:bg-[var(--border)] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="flex-1 py-3.5 bg-[var(--text)] text-[var(--background)] rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
          >
            Add Category
          </button>
        </div>
      </form>
    );
  };

  const sanitizeSlug = (input: string) =>
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // ==================== UPDATED UPLOAD & DELETE HELPERS ====================
  const uploadImage = async (file: File, storySlug: string): Promise<{ secure_url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("storySlug", storySlug);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${file.name} - ${errorText}`);
    }
    return await res.json();
  };

const deleteFromCloudinary = async (publicId?: string | null, folder?: string) => {
  if (!publicId && !folder) return;

  try {
    const body: any = { invalidate: true };
    if (publicId) body.public_id = publicId;
    if (folder) body.folder = folder;

    const res = await fetch("/api/cloudinary-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn("Delete request failed:", await res.text());
    }
  } catch (err) {
    console.error("Cloudinary delete request failed for:", publicId || folder, err);
  }
};

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("stories")
      .select("category")
      .not("category", "is", null);
    const uniqueCats = [...new Set(data?.map((s) => s.category).filter(Boolean))];
    setCategories(uniqueCats);
  };

  const fetchStories = async () => {
    const { data } = await supabase.from("stories").select("*").order("created_at", { ascending: false });
    setStories(data || []);
  };

  const fetchGalleryImages = async (storyId: number) => {
    const { data } = await supabase
      .from("story_images")
      .select("*")
      .eq("story_id", storyId)
      .order("order_index", { ascending: true });
    setEditGalleryImages(data || []);
  };

  const handleUnlock = () => {
    if (password === ADMIN_SECRET) {
      setIsUnlocked(true);
      setUnlockError("");
      fetchCategories();
      fetchStories();
    } else {
      setUnlockError("Wrong secret! Try again.");
    }
  };

// ==================== PERMANENT DELETE STORY (Full Folder Cleanup) ====================
const handleDelete = async () => {
  if (!deleteModal) return;
  setIsDeleting(true);

  try {
    const storyId = deleteModal.id;
    const storyData = stories.find(s => s.id === storyId);
    if (!storyData || !storyData.slug) {
      throw new Error("Story or slug not found");
    }

    const slug = storyData.slug;
    const folderPath = `stories/${slug}`;

    // 1. Delete all gallery images (using their stored public_id)
    const { data: images } = await supabase
      .from("story_images")
      .select("public_id")
      .eq("story_id", storyId);

    if (images && images.length > 0) {
      await Promise.all(images.map((img) => deleteFromCloudinary(img.public_id)));
    }

    // 2. Delete main images (at least desktop_main is stored)
    const { data: story } = await supabase
      .from("stories")
      .select("public_id")
      .eq("id", storyId)
      .single();

    if (story?.public_id) {
      await deleteFromCloudinary(story.public_id);
    }

    // 3. Nuclear option: Delete everything under the folder + the folder itself
    await deleteFromCloudinary(undefined, folderPath);

    // 4. Delete from Supabase
    await supabase.from("story_images").delete().eq("story_id", storyId);
    await supabase.from("stories").delete().eq("id", storyId);

    setDeleteModal(null);
    fetchStories();

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);

  } catch (err: any) {
    console.error("Delete failed:", err);
    setErrorMsg("Failed to delete story. Check console for details.");
  } finally {
    setIsDeleting(false);
  }
};

  const openEditModal = (story: any) => {
    setEditingStory(story);
    setEditTitle(story.title);
    setEditSlug(story.slug);
    setEditCategory(story.category);
    setEditYear(story.year);
    setCurrentDesktopMainUrl(story.desktop_main);
    setCurrentDesktopHoverUrl(story.desktop_hover);
    setCurrentMobileMainUrl(story.mobile_main);
    setNewDesktopMainFile(null);
    setNewDesktopHoverFile(null);
    setNewMobileMainFile(null);
    setNewGalleryDesktopFiles([]);
    setNewGalleryMobileFiles([]);
    setEditError("");
    setEditSuccess(false);
    fetchGalleryImages(story.id);
  };

  const handleDeleteGalleryImage = async (imageId: number, publicId: string) => {
    try {
      await deleteFromCloudinary(publicId);
      await supabase.from("story_images").delete().eq("id", imageId);
      setEditGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  // ==================== UPDATE STORY ====================
  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    setIsUpdating(true);
    setEditError("");
    setEditSuccess(false);

    try {
      let desktopMainUrl = currentDesktopMainUrl;
      let desktopHoverUrl = currentDesktopHoverUrl;
      let mobileMainUrl = currentMobileMainUrl;
      let mainPublicId = editingStory.public_id;

      // Replace Desktop Main
      if (newDesktopMainFile) {
        await deleteFromCloudinary(editingStory.public_id);
        const result = await uploadImage(newDesktopMainFile, editingStory.slug);
        desktopMainUrl = result.secure_url;
        mainPublicId = result.public_id;
      }

      // Replace Desktop Hover
      if (newDesktopHoverFile) {
        const result = await uploadImage(newDesktopHoverFile, editingStory.slug);
        desktopHoverUrl = result.secure_url;
      }

      // Replace Mobile Main
      if (newMobileMainFile) {
        const result = await uploadImage(newMobileMainFile, editingStory.slug);
        mobileMainUrl = result.secure_url;
      }

      const { error: storyError } = await supabase
        .from("stories")
        .update({
          title: editTitle.trim(),
          slug: sanitizeSlug(editSlug),
          category: editCategory.trim(),
          year: editYear.trim(),
          desktop_main: desktopMainUrl,
          desktop_hover: desktopHoverUrl,
          mobile_main: mobileMainUrl,
          public_id: mainPublicId,
        })
        .eq("id", editingStory.id);

      if (storyError) throw storyError;

      // Upload new gallery images
      const uploadNewGallery = async (files: File[], type: "desktop" | "mobile") => {
        const startIndex = editGalleryImages.filter((img) => img.type === type).length;
        for (let i = 0; i < files.length; i++) {
          const result = await uploadImage(files[i], editingStory.slug);
          await supabase.from("story_images").insert({
            story_id: editingStory.id,
            type,
            image_url: result.secure_url,
            public_id: result.public_id,
            order_index: startIndex + i,
          });
        }
      };

      if (newGalleryDesktopFiles.length > 0) await uploadNewGallery(newGalleryDesktopFiles, "desktop");
      if (newGalleryMobileFiles.length > 0) await uploadNewGallery(newGalleryMobileFiles, "mobile");

      fetchStories();
      fetchGalleryImages(editingStory.id);
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setEditingStory(null);
      }, 1800);
    } catch (err: any) {
      setEditError(err.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // ==================== PUBLISH NEW STORY ====================
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg(false);

    if (!title || !slug || !category || !year || !desktopMain || !desktopHover || !mobileMain) {
      setErrorMsg("Please fill all fields and upload main images.");
      return;
    }
    if (galleryDesktop.length === 0 || galleryMobile.length === 0) {
      setErrorMsg("Please upload at least one image for both galleries.");
      return;
    }

    const sanitizedSlug = sanitizeSlug(slug);
    if (sanitizedSlug.length < 3) {
      setErrorMsg("Slug must be at least 3 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existing } = await supabase
        .from("stories")
        .select("id")
        .eq("slug", sanitizedSlug)
        .maybeSingle();

      if (existing) {
        setErrorMsg("This slug already exists.");
        return;
      }

      // Upload main images
      const [dMain, dHover, mMain] = await Promise.all([
        uploadImage(desktopMain, sanitizedSlug),
        uploadImage(desktopHover, sanitizedSlug),
        uploadImage(mobileMain, sanitizedSlug),
      ]);

      const { data: storyData, error: storyError } = await supabase
        .from("stories")
        .insert({
          slug: sanitizedSlug,
          title: title.trim(),
          category: category.trim(),
          year: year.trim(),
          desktop_main: dMain.secure_url,
          desktop_hover: dHover.secure_url,
          mobile_main: mMain.secure_url,
          public_id: dMain.public_id,
        })
        .select("id")
        .single();

      if (storyError) throw storyError;

      // Upload gallery
      const uploadGallery = async (files: File[], type: "desktop" | "mobile") => {
        for (let i = 0; i < files.length; i++) {
          const result = await uploadImage(files[i], sanitizedSlug);
          await supabase.from("story_images").insert({
            story_id: storyData.id,
            type,
            image_url: result.secure_url,
            public_id: result.public_id,
            order_index: i,
          });
        }
      };

      await Promise.all([
        uploadGallery(galleryDesktop, "desktop"),
        uploadGallery(galleryMobile, "mobile"),
      ]);

      setSuccessMsg(true);
      fetchStories();

      // Reset form
      setTitle("");
      setSlug("");
      setCategory("");
      setYear("");
      setDesktopMain(null);
      setDesktopHover(null);
      setMobileMain(null);
      setGalleryDesktop([]);
      setGalleryMobile([]);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== UI REMAINS THE SAME (only small change in gallery delete) ====================
  if (!isUnlocked) {
    return (
      <section
        id="admin-login"
        className="min-h-screen flex items-center justify-center px-6 md:px-[6vw] py-20 font-[blauer]"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-[380px] w-full text-center">
          <div className="flex justify-center mb-12">
            <Link
              href="/"
              className="px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium border border-[var(--border)] rounded-2xl hover:bg-[var(--text)] hover:text-[var(--background)] transition-all active:scale-95"
            >
              ← Home
            </Link>
          </div>

          <h1 className="text-5xl md:text-6xl font-light tracking-[-0.03em] mb-12">
            ADMIN
          </h1>

          <div className="space-y-8">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret key"
                className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-7 py-4 rounded-2xl text-center text-[15px] transition-all focus:ring-1 focus:ring-[var(--text)]/30"
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              />
              {unlockError && (
                <p className="text-red-400 text-sm mt-3 text-center">{unlockError}</p>
              )}
            </div>

            <button
              onClick={handleUnlock}
              className="w-full bg-[var(--text)] text-[var(--background)] py-4 rounded-2xl text-sm tracking-[0.2em] uppercase font-medium hover:opacity-90 active:scale-[0.985] transition-all disabled:opacity-60"
            >
              UNLOCK PANEL
            </button>
          </div>

          <p className="text-[var(--text-muted)] text-xs tracking-widest mt-16">
            Restricted Access
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full px-6 md:px-[6vw] py-5 md:py-5 font-[blauer]" style={{ background: "var(--background)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-center mb-12">
          <Link
            href="/"
            className="px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium border border-[var(--border)] rounded-2xl hover:bg-[var(--text)] hover:text-[var(--background)] transition-all active:scale-95"
          >
            ← Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-light tracking-[-0.03em] text-center mb-12">
          DASHBOARD
        </h1>

        {/* TABS - unchanged */}
        <div className="flex border-b border-[var(--border)] mb-10">
          <button
            onClick={() => setActiveTab("publish")}
            className={`flex-1 py-4 text-sm tracking-widest uppercase transition-all relative
              ${activeTab === "publish"
                ? "font-medium text-[var(--text)] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[var(--text)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
          >
            Make Stories
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex-1 py-4 text-sm tracking-widest uppercase transition-all relative
              ${activeTab === "manage"
                ? "font-medium text-[var(--text)] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[var(--text)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
          >
            Manage Stories
          </button>
        </div>

        {/* PUBLISH TAB - unchanged */}
        {activeTab === "publish" && (
          <form onSubmit={handlePublish} className="space-y-10">
            {/* ... all your form fields (title, slug, category, year, main images, gallery) are exactly the same ... */}
            {/* I kept it identical to save space - copy from your original code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">STORY TITLE</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Golden Hour Vows — Sarah & Mark" className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px] transition-all" required />
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">SLUG</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="golden-hour-vows" className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px] transition-all" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">CATEGORY</label>
                <button type="button" onClick={() => setShowCategoryModal(true)} className="w-full text-left bg-transparent border border-[var(--border)] hover:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px] transition-all">
                  {category || "Select Category"}
                </button>
              </div>
              <div>
                <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">YEAR</label>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} min="2000" max="2100" placeholder="2025" className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px] transition-all" required />
              </div>
            </div>

            {/* Main Images Section - same as original */}
            <div className="pt-8 border-t border-[var(--border)]">
              <h3 className="text-lg mb-6">Main Images</h3>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "DESKTOP MAIN", file: desktopMain, setter: setDesktopMain },
                  { label: "DESKTOP HOVER", file: desktopHover, setter: setDesktopHover },
                  { label: "MOBILE MAIN", file: mobileMain, setter: setMobileMain },
                ].map(({ label, file, setter }) => {
                  const status = file ? "done" : "idle";
                  return (
                    <div key={label} className="flex flex-col items-center">
                      <p className="text-xs text-[var(--text-muted)] mb-3 text-center tracking-widest">{label}</p>
                      <label className={`block w-24 h-24 border-2 border-dashed flex items-center justify-center rounded-2xl cursor-pointer transition-all ${status === "done" ? "border-emerald-500 bg-emerald-500/10" : "border-[var(--border)] hover:border-[var(--text)]"}`}>
                        <div className="flex flex-col items-center">
                          {status === "done" ? <span className="text-4xl text-emerald-500">✓</span> : <span className="text-5xl text-[var(--text-muted)] opacity-60">+</span>}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => setter(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gallery Section - same as original */}
            <div className="pt-8 border-t border-[var(--border)]">
              <h3 className="text-lg mb-6">Gallery Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-3 text-[var(--text-muted)]">DESKTOP GALLERY</p>
                  <label className="block border-2 border-dashed border-[var(--border)] hover:border-[var(--text)] py-10 rounded-3xl cursor-pointer transition-all text-center">
                    <span className="text-5xl text-[var(--text-muted)] block mb-2">+</span>
                    <p className="text-sm tracking-widest">Upload Desktop Images</p>
                    <input type="file" multiple accept="image/*" onChange={(e) => setGalleryDesktop(Array.from(e.target.files || []))} className="hidden" />
                  </label>
                  {galleryDesktop.length > 0 && <p className="text-emerald-600 text-sm mt-3 text-center">{galleryDesktop.length} images selected</p>}
                </div>

                <div>
                  <p className="text-xs tracking-widest uppercase mb-3 text-[var(--text-muted)]">MOBILE GALLERY</p>
                  <label className="block border-2 border-dashed border-[var(--border)] hover:border-[var(--text)] py-10 rounded-3xl cursor-pointer transition-all text-center">
                    <span className="text-5xl text-[var(--text-muted)] block mb-2">+</span>
                    <p className="text-sm tracking-widest">Upload Mobile Images</p>
                    <input type="file" multiple accept="image/*" onChange={(e) => setGalleryMobile(Array.from(e.target.files || []))} className="hidden" />
                  </label>
                  {galleryMobile.length > 0 && <p className="text-emerald-600 text-sm mt-3 text-center">{galleryMobile.length} images selected</p>}
                </div>
              </div>
            </div>

            {errorMsg && <div className="text-red-400 text-sm py-4 px-6 border border-red-400/30 rounded-2xl">{errorMsg}</div>}
            {successMsg && <div className="text-emerald-600 text-center py-6 border border-emerald-600/30 rounded-2xl">Story Published Successfully!</div>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--text)] text-[var(--background)] py-4 rounded-2xl text-sm tracking-[0.15em] uppercase font-medium hover:opacity-90 active:scale-[0.985] disabled:opacity-60 transition-all">
              {isSubmitting ? "PUBLISHING STORY..." : "PUBLISH STORY"}
            </button>
          </form>
        )}

        {/* MANAGE TAB - unchanged */}
        {activeTab === "manage" && (
          <div>
            <h3 className="text-xl mb-8 flex items-center gap-3">
              All Stories
              <span className="text-xs bg-[var(--border)] px-4 py-1.5 rounded-full text-[var(--text-muted)]">{stories.length}</span>
            </h3>

            <div className="space-y-5">
              {stories.map((story) => (
                <div key={story.id} className="group border border-[var(--border)] hover:border-[var(--text)] transition-all px-6 py-6 rounded-3xl bg-[var(--background)] flex flex-col sm:flex-row gap-5 sm:items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0 mx-auto sm:mx-0">
                    <img src={story.desktop_main} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <p className="font-medium text-[17px] leading-tight mb-1.5">{story.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {story.category} • {story.year} • <span className="font-mono">/{story.slug}</span>
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <button onClick={() => openEditModal(story)} className="flex-1 sm:flex-none px-7 py-3.5 text-sm border border-[var(--text)] rounded-2xl hover:bg-[var(--text)] hover:text-[var(--background)] transition-all">EDIT</button>
                    <button onClick={() => setDeleteModal({ id: story.id, title: story.title })} className="flex-1 sm:flex-none px-7 py-3.5 text-sm border border-red-400 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">DELETE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT MODAL - only small change: pass public_id instead of image_url */}
        {editingStory && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] p-4">
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-3xl w-full max-w-[640px] max-h-[94vh] overflow-hidden flex flex-col">
              <div className="px-6 md:px-8 pt-6 pb-4 border-b border-[var(--border)] flex items-center justify-between">
                <h2 className="text-2xl font-light">Edit Story</h2>
                <button onClick={() => setEditingStory(null)} className="text-[var(--text-muted)] hover:text-[var(--text)] text-3xl leading-none transition-colors">×</button>
              </div>

              <form onSubmit={handleUpdateStory} className="flex-1 overflow-auto p-6 md:p-8 space-y-10">
                {/* Title, Slug, Category, Year - unchanged */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">TITLE</label>
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px]" required />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">SLUG</label>
                    <input type="text" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px]" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">CATEGORY</label>
                    <button type="button" onClick={() => setShowCategoryModal(true)} className="w-full text-left border border-[var(--border)] hover:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px] transition-all">
                      {editCategory || "Select Category"}
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.12em] uppercase mb-2 text-[var(--text-muted)]">YEAR</label>
                    <input type="number" value={editYear} onChange={(e) => setEditYear(e.target.value)} className="w-full bg-transparent border border-[var(--border)] focus:border-[var(--text)] px-6 py-4 rounded-2xl text-[15px]" required />
                  </div>
                </div>

                {/* Main Images - unchanged */}
                <div>
                  <h3 className="text-lg mb-6">Main Images (tap to replace)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: "Desktop Main", url: currentDesktopMainUrl, file: newDesktopMainFile, setter: setNewDesktopMainFile },
                      { label: "Desktop Hover", url: currentDesktopHoverUrl, file: newDesktopHoverFile, setter: setNewDesktopHoverFile },
                      { label: "Mobile Main", url: currentMobileMainUrl, file: newMobileMainFile, setter: setNewMobileMainFile },
                    ].map(({ label, url, file, setter }) => (
                      <div key={label} className="text-center">
                        <p className="text-xs text-[var(--text-muted)] mb-3 tracking-widest">{label}</p>
                        <label className="block cursor-pointer relative group">
                          <img src={file ? URL.createObjectURL(file) : url} alt={label} className="w-30 h-30 md:w-24 md:h-24 object-cover rounded-2xl border-2 border-dashed border-[var(--border)] mx-auto transition-all group-hover:border-[var(--text)]" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all">
                            <span className="text-white text-[10px] font-medium tracking-widest">REPLACE</span>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => setter(e.target.files?.[0] || null)} className="hidden" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Section - CHANGED: pass public_id to delete */}
                <div>
                  <h3 className="text-lg mb-6">Gallery Images</h3>

                  <div className="mb-10">
                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
                      Desktop Gallery ({editGalleryImages.filter((i) => i.type === "desktop").length})
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {editGalleryImages
                        .filter((img) => img.type === "desktop")
                        .map((img) => (
                          <div key={img.id} className="relative group">
                            <img src={img.image_url} alt="" className="w-full aspect-square object-cover rounded-2xl" />
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(img.id, img.public_id || img.image_url)}  // ← use public_id
                              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-10">
                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
                      Mobile Gallery ({editGalleryImages.filter((i) => i.type === "mobile").length})
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {editGalleryImages
                        .filter((img) => img.type === "mobile")
                        .map((img) => (
                          <div key={img.id} className="relative group">
                            <img src={img.image_url} alt="" className="w-full aspect-square object-cover rounded-2xl" />
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(img.id, img.public_id || img.image_url)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-3">Add Desktop</p>
                      <label className="block border-2 border-dashed border-[var(--border)] hover:border-[var(--text)] py-10 rounded-3xl cursor-pointer transition-all text-center">
                        <span className="text-5xl text-[var(--text-muted)] block mb-2">+</span>
                        <p className="text-sm tracking-widest">Upload Desktop Images</p>
                        <input type="file" multiple accept="image/*" onChange={(e) => setNewGalleryDesktopFiles(Array.from(e.target.files || []))} className="hidden" />
                      </label>
                      {newGalleryDesktopFiles.length > 0 && <p className="text-emerald-600 text-sm mt-3 text-center">{newGalleryDesktopFiles.length} new files</p>}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest mb-3">Add Mobile</p>
                      <label className="block border-2 border-dashed border-[var(--border)] hover:border-[var(--text)] py-10 rounded-3xl cursor-pointer transition-all text-center">
                        <span className="text-5xl text-[var(--text-muted)] block mb-2">+</span>
                        <p className="text-sm tracking-widest">Upload Mobile Images</p>
                        <input type="file" multiple accept="image/*" onChange={(e) => setNewGalleryMobileFiles(Array.from(e.target.files || []))} className="hidden" />
                      </label>
                      {newGalleryMobileFiles.length > 0 && <p className="text-emerald-600 text-sm mt-3 text-center">{newGalleryMobileFiles.length} new files</p>}
                    </div>
                  </div>
                </div>

                {editError && <div className="text-red-400 text-sm py-4 px-6 border border-red-400/30 rounded-2xl">{editError}</div>}
                {editSuccess && <div className="text-emerald-600 text-center py-6 border border-emerald-600/30 rounded-2xl">Story Updated Successfully!</div>}

                <button type="submit" disabled={isUpdating} className="w-full bg-[var(--text)] text-[var(--background)] py-4 rounded-2xl text-sm tracking-[0.15em] uppercase font-medium hover:opacity-90 active:scale-[0.985] disabled:opacity-60 transition-all">
                  {isUpdating ? "UPDATING STORY..." : "SAVE CHANGES"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL - unchanged */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-3xl w-full max-w-sm p-8 text-center">
              <h3 className="text-2xl font-light mb-4">Delete Story?</h3>
              <p className="text-[var(--text-muted)] mb-10 leading-relaxed text-sm">
                “{deleteModal.title}” will be permanently deleted from both database and Cloudinary.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteModal(null)} className="flex-1 py-3.5 border border-[var(--border)] rounded-2xl text-sm font-medium hover:bg-[var(--border)] transition-all">CANCEL</button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-60">
                  {isDeleting ? "DELETING..." : "YES, DELETE"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================== CATEGORY MODAL (Improved) ====================== */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-[var(--background)] border border-[var(--border)] rounded-3xl w-full max-w-[420px] overflow-hidden">

              {/* Header */}
              <div className="p-7 border-b border-[var(--border)]">
                <h3 className="text-[21px] font-light text-center">Select or Add Category</h3>
              </div>

              <div className="p-7 space-y-6">

                {/* Pre-defined Categories */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">Quick Select</p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Wedding", "Pre-Wedding", "Engagement", "Motherhood", "Commercial"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (editingStory) setEditCategory(item);
                          else setCategory(item);
                          setShowCategoryModal(false);
                        }}
                        className="px-5 py-4 text-sm border border-[var(--border)] hover:bg-[var(--text)] hover:text-[var(--background)] rounded-2xl transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Category */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-3">Add Custom Category</p>
                  <CustomCategoryInput
                    onAdd={(newCat) => {
                      if (editingStory) setEditCategory(newCat);
                      else setCategory(newCat);
                      setShowCategoryModal(false);
                    }}
                    onCancel={() => setShowCategoryModal(false)}
                  />
                </div>
              </div>

              {/* Cancel Button at bottom */}
              <div className="border-t border-[var(--border)] p-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="w-full py-3.5 text-sm tracking-widest uppercase hover:bg-[var(--border)] rounded-2xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}