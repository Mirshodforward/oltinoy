"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { imageUrl, productImageLoader } from "@/lib/images";
import { saveProduct, postProductChannel } from "@/app/(admin)/admin/(protected)/mahsulotlar/actions";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Megaphone,
  Repeat,
  Trash,
} from "@/components/ui/icons";

const ALL_SIZES = ["46", "48", "50", "52", "54", "56"];

type ImageItem = { fileName: string; width: number; height: number; altUz: string; altRu: string };
type Category = { id: number; nameUz: string };

export type ProductInitial = {
  id: number;
  nameUz: string;
  nameRu: string;
  slug: string;
  sku: string | null;
  descriptionUz: string | null;
  descriptionRu: string | null;
  materialUz: string | null;
  materialRu: string | null;
  price: number;
  oldPrice: number | null;
  sizes: string[];
  minOrderQty: number;
  categoryId: number;
  status: "ACTIVE" | "SOLD_OUT" | "HIDDEN";
  isNew: boolean;
  images: ImageItem[];
  alreadyPosted: boolean;
};

/**
 * One labelled block of the form. Twelve fields in a single column is a wall;
 * five short cards each announced by a kicker is a checklist you can finish.
 */
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

/**
 * The native checkbox stays the control (it is the peer); the gold box next to
 * it is the visible state. The whole row is a 44px tap target.
 */
function CheckboxRow({
  id,
  name,
  checked,
  onChange,
  label,
  hint,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className="flex h-6 w-6 flex-none items-center justify-center rounded-xs border border-sand bg-paper text-transparent transition-colors duration-200 peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold"
        >
          <Check size={15} />
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </label>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const uid = useId();

  const [nameUz, setNameUz] = useState(initial?.nameUz ?? "");
  const [nameRu, setNameRu] = useState(initial?.nameRu ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [descriptionUz, setDescriptionUz] = useState(initial?.descriptionUz ?? "");
  const [descriptionRu, setDescriptionRu] = useState(initial?.descriptionRu ?? "");
  const [materialUz, setMaterialUz] = useState(initial?.materialUz ?? "");
  const [materialRu, setMaterialRu] = useState(initial?.materialRu ?? "");
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : "");
  const [oldPrice, setOldPrice] = useState(initial?.oldPrice ? String(initial.oldPrice) : "");
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? ["46", "48", "50", "52", "54", "56"]);
  const [minOrderQty, setMinOrderQty] = useState(String(initial?.minOrderQty ?? 1));
  const [categoryId, setCategoryId] = useState(String(initial?.categoryId ?? categories[0]?.id ?? ""));
  const [status, setStatus] = useState(initial?.status ?? "ACTIVE");
  const [isNew, setIsNew] = useState(initial?.isNew ?? true);
  const [images, setImages] = useState<ImageItem[]>(initial?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [alreadyPosted, setAlreadyPosted] = useState(initial?.alreadyPosted ?? false);
  const [dragging, setDragging] = useState(false);

  function toggleSize(s: string) {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort()));
  }

  async function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (images.length + files.length > 10) {
      setError("Ko'pi bilan 10 ta rasm");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setError("Rasm yuklashda xatolik");
        return;
      }
      const json = (await res.json()) as { images: { fileName: string; width: number; height: number }[] };
      setImages((prev) => [...prev, ...json.images.map((i) => ({ ...i, altUz: "", altRu: "" }))]);
    } catch {
      setError("Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }
  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }
  function setAlt(idx: number, key: "altUz" | "altRu", val: string) {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, [key]: val } : img)));
  }

  function buildPayload() {
    return {
      ...(initial ? { id: initial.id } : {}),
      nameUz: nameUz.trim(),
      nameRu: nameRu.trim(),
      slug: slug.trim(),
      sku: sku.trim(),
      descriptionUz,
      descriptionRu,
      materialUz,
      materialRu,
      price: parseInt(price || "0", 10),
      oldPrice: oldPrice ? parseInt(oldPrice, 10) : null,
      sizes,
      minOrderQty: parseInt(minOrderQty || "1", 10),
      categoryId: parseInt(categoryId, 10),
      status,
      isNew,
      images: images.map((i) => ({ fileName: i.fileName, width: i.width, height: i.height, altUz: i.altUz, altRu: i.altRu })),
    };
  }

  async function submit(thenPost: boolean) {
    setError("");
    setNotice("");
    if (!nameUz.trim() || !nameRu.trim() || !price || sizes.length === 0) {
      setError("Nom (uz/ru), narx va kamida bitta o'lcham majburiy");
      return;
    }
    setSaving(true);
    try {
      const res = await saveProduct(buildPayload());
      if (!res.ok) {
        setError(res.error);
        return;
      }

      if (res.channelPosted) {
        setNotice("Mahsulot saqlandi va kanalga joylandi");
      } else if (res.channelError) {
        setNotice(`Saqlandi, lekin kanalga joylanmadi: ${res.channelError}`);
      }

      if (thenPost && !res.channelPosted) {
        setPosting(true);
        const pr = await postProductChannel(res.id, false);
        setPosting(false);
        if (!pr.ok) {
          setNotice(`Saqlandi, lekin kanalga joylanmadi: ${pr.error}`);
          router.push(`/admin/mahsulotlar/${res.id}`);
          router.refresh();
          return;
        }
        setNotice("Mahsulot saqlandi va kanalga joylandi");
      }

      router.push(isEdit ? `/admin/mahsulotlar/${res.id}` : "/admin/mahsulotlar");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error && e.message === "UNAUTHORIZED" ? "Sessiya tugagan" : "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  async function repost() {
    if (!initial) return;
    setPosting(true);
    setError("");
    setNotice("");
    const pr = await postProductChannel(initial.id, true);
    setPosting(false);
    setNotice(pr.ok ? "Kanalga qayta joylandi" : `Xatolik: ${pr.error}`);
    if (pr.ok) setAlreadyPosted(true);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* ───────────────────── Status messages ───────────────────── */}
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
        >
          <AlertCircle size={18} className="mt-px flex-none" />
          {error}
        </p>
      )}
      {/* The channel result arrives after the save round-trip — announce it. */}
      <div aria-live="polite" className="empty:hidden">
        {notice && (
          <p className="flex items-start gap-2.5 rounded-sm border border-sage/35 bg-sage/10 px-4 py-3 text-sm font-semibold text-sage">
            <CheckCircle size={18} className="mt-px flex-none" />
            {notice}
          </p>
        )}
      </div>

      {/* ───────────────────────── Basics ───────────────────────── */}
      <Section kicker="Asosiy" hint="Kartochkada va kanalda ko'rinadigan nom, artikul va kategoriya.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={`${uid}-nameUz`}>
              Nomi (UZ) *
            </label>
            <input
              id={`${uid}-nameUz`}
              name="nameUz"
              className="field-input"
              value={nameUz}
              onChange={(e) => setNameUz(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-nameRu`}>
              Nomi (RU) *
            </label>
            <input
              id={`${uid}-nameRu`}
              name="nameRu"
              className="field-input"
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-sku`}>
              SKU (artikul)
            </label>
            <input
              id={`${uid}-sku`}
              name="sku"
              className="field-input"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="A-102"
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-categoryId`}>
              Kategoriya *
            </label>
            <select
              id={`${uid}-categoryId`}
              name="categoryId"
              className="field-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameUz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* ───────────────────── Pricing & sizes ───────────────────── */}
      <Section kicker="Narx va o'lchamlar" hint="Optom narx so'mda. Eski narx kiritilsa, kartochkada chegirma ko'rinadi.">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="field-label" htmlFor={`${uid}-price`}>
              Narx (so'm) *
            </label>
            <input
              id={`${uid}-price`}
              name="price"
              type="number"
              inputMode="numeric"
              className="field-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-oldPrice`}>
              Eski narx (ixtiyoriy)
            </label>
            <input
              id={`${uid}-oldPrice`}
              name="oldPrice"
              type="number"
              inputMode="numeric"
              className="field-input"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-minOrderQty`}>
              Min. buyurtma
            </label>
            <input
              id={`${uid}-minOrderQty`}
              name="minOrderQty"
              type="number"
              inputMode="numeric"
              min={1}
              className="field-input"
              value={minOrderQty}
              onChange={(e) => setMinOrderQty(e.target.value)}
            />
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="field-label">O'lchamlar *</legend>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <button key={s} type="button" onClick={() => toggleSize(s)} aria-pressed={sizes.includes(s)} className="chip">
                {s}
              </button>
            ))}
          </div>
          <p className="field-hint">Tanlangan o'lchamlar bron formasida chiqadi — kamida bittasi kerak.</p>
        </fieldset>
      </Section>

      {/* ───────────────────── Copy (uz / ru) ───────────────────── */}
      <Section kicker="Tavsif" hint="Material va tavsif ikkala tilda — mahsulot sahifasida shu matn chiqadi.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={`${uid}-materialUz`}>
              Materiali (UZ)
            </label>
            <input
              id={`${uid}-materialUz`}
              name="materialUz"
              className="field-input"
              value={materialUz}
              onChange={(e) => setMaterialUz(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-materialRu`}>
              Materiali (RU)
            </label>
            <input
              id={`${uid}-materialRu`}
              name="materialRu"
              className="field-input"
              value={materialRu}
              onChange={(e) => setMaterialRu(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-descriptionUz`}>
              Tavsif (UZ)
            </label>
            <textarea
              id={`${uid}-descriptionUz`}
              name="descriptionUz"
              rows={4}
              className="field-input resize-y"
              value={descriptionUz}
              onChange={(e) => setDescriptionUz(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`${uid}-descriptionRu`}>
              Tavsif (RU)
            </label>
            <textarea
              id={`${uid}-descriptionRu`}
              name="descriptionRu"
              rows={4}
              className="field-input resize-y"
              value={descriptionRu}
              onChange={(e) => setDescriptionRu(e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* ───────────────────────── Images ───────────────────────── */}
      <Section kicker="Rasmlar" hint={`Birinchisi asosiy — kartochkada va kanalda o'sha ishlatiladi. ${images.length}/10`}>
        {images.length > 0 && (
          <ul className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <li key={img.fileName} className="card p-2.5">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-cream">
                  <Image
                    loader={productImageLoader}
                    src={imageUrl(img.fileName, "sm", "webp")}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {i === 0 && <span className="badge badge-new absolute left-2 top-2">Asosiy</span>}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`${i + 1}-rasmni o'chirish`}
                    className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-ink/70 text-ivory backdrop-blur transition-colors duration-200 hover:bg-danger"
                  >
                    <Trash size={17} />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`${i + 1}-rasmni oldinga surish`}
                    className="btn btn-ghost btn-sm px-2.5"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label={`${i + 1}-rasmni orqaga surish`}
                    className="btn btn-ghost btn-sm px-2.5"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <span className="ml-auto text-2xs font-bold tracking-[0.14em]" style={{ color: "var(--fg-subtle)" }}>
                    {i + 1}/{images.length}
                  </span>
                </div>

                <label className="sr-only" htmlFor={`${uid}-altuz-${img.fileName}`}>
                  {i + 1}-rasm alt matni (UZ)
                </label>
                <input
                  id={`${uid}-altuz-${img.fileName}`}
                  className="field-input mt-2 text-sm"
                  placeholder="Alt (UZ)"
                  value={img.altUz}
                  onChange={(e) => setAlt(i, "altUz", e.target.value)}
                />
                <label className="sr-only" htmlFor={`${uid}-altru-${img.fileName}`}>
                  {i + 1}-rasm alt matni (RU)
                </label>
                <input
                  id={`${uid}-altru-${img.fileName}`}
                  className="field-input mt-1.5 text-sm"
                  placeholder="Alt (RU)"
                  value={img.altRu}
                  onChange={(e) => setAlt(i, "altRu", e.target.value)}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Drop target and file picker are the same label — one obvious place. */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void onUpload(e.dataTransfer.files);
          }}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed px-5 py-9 text-center transition-colors duration-200",
            "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
            dragging ? "border-gold bg-gold/10" : "border-sand hover:border-gold hover:bg-cream/60",
          ].join(" ")}
        >
          <ImageIcon size={26} style={{ color: "var(--color-gold-dk)" }} />
          <span className="text-sm font-semibold">{uploading ? "Yuklanmoqda…" : "Rasm qo'shish"}</span>
          <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>
            Bosing yoki fayllarni shu yerga tashlang · JPEG, PNG, WebP
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(e) => onUpload(e.target.files)}
          />
        </label>
      </Section>

      {/* ───────────────────────── SEO / slug ───────────────────────── */}
      <Section kicker="SEO" hint="Manzil qatoridagi havola. Bo'sh qoldirilsa nomdan avtomatik yasaladi.">
        <div className="md:max-w-md">
          <label className="field-label" htmlFor={`${uid}-slug`}>
            Slug
          </label>
          <input
            id={`${uid}-slug`}
            name="slug"
            className="field-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="avto-generatsiya"
          />
          {isEdit && (
            <p className="field-hint flex items-center gap-1.5" style={{ color: "var(--color-rose-dk)" }}>
              <AlertCircle size={14} className="flex-none" />
              E'lon qilingandan keyin slugni o'zgartirmang (SEO).
            </p>
          )}
        </div>
      </Section>

      {/* ───────────────────── Publishing & actions ───────────────────── */}
      <Section kicker="Chop etish" hint="Holat saytdagi ko'rinishni belgilaydi; kanalga joylash Telegramga e'lon yuboradi.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={`${uid}-status`}>
              Holati
            </label>
            <select
              id={`${uid}-status`}
              name="status"
              className="field-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductInitial["status"])}
            >
              <option value="ACTIVE">Sotuvda (ACTIVE)</option>
              <option value="SOLD_OUT">Sotilgan (SOLD_OUT)</option>
              <option value="HIDDEN">Yashirin (HIDDEN)</option>
            </select>
          </div>
          <div className="flex items-end pb-1.5">
            <CheckboxRow
              id={`${uid}-isNew`}
              name="isNew"
              checked={isNew}
              onChange={setIsNew}
              label={`"Yangi" belgisi`}
            />
          </div>
        </div>

        <div className="hairline my-6" />

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => submit(false)} disabled={saving} className="btn btn-primary">
            {saving && !posting ? (
              "Saqlanmoqda…"
            ) : isEdit ? (
              "Saqlash"
            ) : (
              <>
                <Megaphone size={17} />
                Saqlash (kanalga avtomatik)
              </>
            )}
          </button>

          {isEdit && !alreadyPosted && (
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={saving}
              className="btn btn-gold"
              title="Kanalga birinchi marta joylash"
            >
              <Megaphone size={17} />
              {posting ? "Joylanmoqda…" : "Kanalga joylash"}
            </button>
          )}

          {isEdit && alreadyPosted && (
            <button
              type="button"
              onClick={repost}
              disabled={posting}
              className="btn btn-outline"
              title="Kanalga qayta e'lon qilish"
            >
              <Repeat size={17} />
              {posting ? "Joylanmoqda…" : "Qayta e'lon qilish"}
            </button>
          )}

          {!isEdit && images.length === 0 && (
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
              Kanalga joylash uchun kamida 1 ta rasm qo&apos;shing
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
