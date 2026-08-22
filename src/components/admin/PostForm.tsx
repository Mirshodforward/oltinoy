"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { savePost, deletePost } from "@/app/(admin)/admin/(protected)/postlar/actions";
import { AlertCircle, Check, Trash } from "@/components/ui/icons";

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

/** A labelled block of the form — kicker, one line of guidance, the fields. */
function Section({ kicker, hint, children }: { kicker: string; hint?: string; children: ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <h2 className="kicker">{kicker}</h2>
      {hint && (
        <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
          {hint}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function PostForm({ initial }: { initial?: PostInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const uid = useId();

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

  return (
    <div className="space-y-4">
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
        >
          <AlertCircle size={18} className="mt-px flex-none" />
          {error}
        </p>
      )}

      {/* ───────────────────────── Basics ───────────────────────── */}
      <Section kicker="Sarlavha" hint="Blog ro'yxatida va sahifa tepasida ko'rinadigan sarlavha — ikkala tilda.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={`${uid}-titleUz`}>
              Sarlavha (UZ) *
            </label>
            <input
              id={`${uid}-titleUz`}
              name="titleUz"
              className="field-input"
              value={titleUz}
              onChange={(e) => setTitleUz(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-titleRu`}>
              Sarlavha (RU) *
            </label>
            <input
              id={`${uid}-titleRu`}
              name="titleRu"
              className="field-input"
              value={titleRu}
              onChange={(e) => setTitleRu(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-excerptUz`}>
              Qisqacha (UZ)
            </label>
            <textarea
              id={`${uid}-excerptUz`}
              name="excerptUz"
              rows={3}
              className="field-input resize-y"
              value={excerptUz}
              onChange={(e) => setExcerptUz(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-excerptRu`}>
              Qisqacha (RU)
            </label>
            <textarea
              id={`${uid}-excerptRu`}
              name="excerptRu"
              rows={3}
              className="field-input resize-y"
              value={excerptRu}
              onChange={(e) => setExcerptRu(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* ───────────────────────── Body ───────────────────────── */}
      <Section kicker="Matn" hint="Markdown: ## sarlavha, **qalin**, - ro'yxat, [havola](url).">
        <div className="grid gap-5">
          <div>
            <label className="field-label" htmlFor={`${uid}-contentUz`}>
              Matn (UZ, markdown) *
            </label>
            <textarea
              id={`${uid}-contentUz`}
              name="contentUz"
              rows={12}
              className="field-input resize-y font-mono text-sm"
              value={contentUz}
              onChange={(e) => setContentUz(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-contentRu`}>
              Matn (RU, markdown) *
            </label>
            <textarea
              id={`${uid}-contentRu`}
              name="contentRu"
              rows={12}
              className="field-input resize-y font-mono text-sm"
              value={contentRu}
              onChange={(e) => setContentRu(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* ───────────────────── SEO / slug / cover ───────────────────── */}
      <Section kicker="SEO va muqova" hint="Slug bo'sh qoldirilsa sarlavhadan avtomatik yasaladi.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={`${uid}-slug`}>
              Slug (ixtiyoriy)
            </label>
            <input
              id={`${uid}-slug`}
              name="slug"
              className="field-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="avto"
            />
            {isEdit && (
              <p className="field-hint flex items-center gap-1.5" style={{ color: "var(--color-rose-dk)" }}>
                <AlertCircle size={14} className="flex-none" />
                Chop etilgandan keyin slugni o'zgartirmang (SEO).
              </p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-coverImage`}>
              Cover rasm URL (ixtiyoriy)
            </label>
            <input
              id={`${uid}-coverImage`}
              name="coverImage"
              className="field-input"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="/uploads/... yoki https://"
            />
          </div>
        </div>
      </Section>

      {/* ───────────────────── Publishing & actions ───────────────────── */}
      <Section kicker="Chop etish">
        <label htmlFor={`${uid}-isPublished`} className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            id={`${uid}-isPublished`}
            name="isPublished"
            type="checkbox"
            className="peer sr-only"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span
            aria-hidden="true"
            className="flex h-6 w-6 flex-none items-center justify-center rounded-xs border border-sand bg-paper text-transparent transition-colors duration-200 peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold"
          >
            <Check size={15} />
          </span>
          <span className="text-sm font-semibold">Chop etilgan (saytda ko'rinadi)</span>
        </label>

        <div className="hairline my-6" />

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={submit} disabled={busy} className="btn btn-primary">
            {busy ? "Saqlanmoqda…" : "Saqlash"}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn border-danger/40 text-danger transition-colors duration-200 hover:bg-danger hover:text-ivory"
            >
              <Trash size={17} />
              O&apos;chirish
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}
