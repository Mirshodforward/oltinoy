"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePost, deletePost } from "@/app/(admin)/admin/(protected)/postlar/actions";

export type PostInitial = {
  id: number;
  slug: string;
  titleUz: string;
  titleRu: string;
  excerptUz: string | null;
  excerptRu: string | null;
  contentUz: string;
  contentRu: string;
  coverImage: string | null;
  isPublished: boolean;
};

export function PostForm({ initial }: { initial?: PostInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [titleUz, setTitleUz] = useState(initial?.titleUz ?? "");
  const [titleRu, setTitleRu] = useState(initial?.titleRu ?? "");
  const [excerptUz, setExcerptUz] = useState(initial?.excerptUz ?? "");
  const [excerptRu, setExcerptRu] = useState(initial?.excerptRu ?? "");
  const [contentUz, setContentUz] = useState(initial?.contentUz ?? "");
  const [contentRu, setContentRu] = useState(initial?.contentRu ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!titleUz.trim() || !titleRu.trim() || !contentUz.trim() || !contentRu.trim()) {
      setError("Sarlavha va matn (uz/ru) majburiy");
      return;
    }
    setBusy(true);
    const res = await savePost({
      ...(initial ? { id: initial.id } : {}),
      slug,
      titleUz,
      titleRu,
      excerptUz,
      excerptRu,
      contentUz,
      contentRu,
      coverImage,
      isPublished,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Xatolik");
      return;
    }
    router.push("/admin/postlar");
    router.refresh();
  }

  async function remove() {
    if (!initial) return;
    if (!confirm("Postni o'chirasizmi?")) return;
    setBusy(true);
    await deletePost(initial.id);
    router.push("/admin/postlar");
    router.refresh();
  }

  const cls = "field-input";
  return (
    <div className="space-y-5">
      {error && <p className="rounded-md px-3 py-2 text-sm" style={{ background: "#fef2f2", color: "#b91c1c" }}>{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">Sarlavha (UZ) *</label>
          <input className={cls} value={titleUz} onChange={(e) => setTitleUz(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Sarlavha (RU) *</label>
          <input className={cls} value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Slug (ixtiyoriy)</label>
          <input className={cls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="avto" />
        </div>
        <div>
          <label className="field-label">Cover rasm URL (ixtiyoriy)</label>
          <input className={cls} value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="/uploads/... yoki https://" />
        </div>
        <div>
          <label className="field-label">Qisqacha (UZ)</label>
          <textarea rows={2} className={`${cls} resize-none`} value={excerptUz} onChange={(e) => setExcerptUz(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Qisqacha (RU)</label>
          <textarea rows={2} className={`${cls} resize-none`} value={excerptRu} onChange={(e) => setExcerptRu(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="field-label">Matn (UZ, markdown) *</label>
        <textarea rows={10} className={`${cls} font-mono text-sm`} value={contentUz} onChange={(e) => setContentUz(e.target.value)} />
      </div>
      <div>
        <label className="field-label">Matn (RU, markdown) *</label>
        <textarea rows={10} className={`${cls} font-mono text-sm`} value={contentRu} onChange={(e) => setContentRu(e.target.value)} />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Chop etilgan (saytda ko'rinadi)
      </label>

      <div className="flex flex-wrap gap-3 border-t pt-5" style={{ borderColor: "var(--color-line)" }}>
        <button type="button" onClick={submit} disabled={busy} className="btn btn-primary">
          {busy ? "Saqlanmoqda…" : "Saqlash"}
        </button>
        {isEdit && (
          <button type="button" onClick={remove} disabled={busy} className="btn btn-outline" style={{ color: "#b91c1c", borderColor: "#b91c1c" }}>
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
}
