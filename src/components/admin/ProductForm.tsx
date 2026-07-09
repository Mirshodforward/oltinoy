"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { imageUrl, productImageLoader } from "@/lib/images";
import { saveProduct, postProductChannel } from "@/app/(admin)/admin/(protected)/mahsulotlar/actions";

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

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

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
        setNotice("Mahsulot saqlandi va kanalga joylandi ✅");
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
        setNotice("Mahsulot saqlandi va kanalga joylandi ✅");
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
    setNotice(pr.ok ? "Kanalga qayta joylandi ✅" : `Xatolik: ${pr.error}`);
    if (pr.ok) setAlreadyPosted(true);
    router.refresh();
  }

  const inputCls = "field-input";

  return (
    <div className="space-y-6">
      {error && <p className="rounded-md px-3 py-2 text-sm" style={{ background: "#fef2f2", color: "#b91c1c" }} role="alert">{error}</p>}
      {notice && <p className="rounded-md px-3 py-2 text-sm" style={{ background: "#ecfdf5", color: "var(--color-sage)" }}>{notice}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label">Nomi (UZ) *</label>
          <input className={inputCls} value={nameUz} onChange={(e) => setNameUz(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Nomi (RU) *</label>
          <input className={inputCls} value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Slug (bo'sh qoldirilsa avtomatik)</label>
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="avto-generatsiya" />
          {isEdit && <p className="mt-1 text-xs" style={{ color: "#b45309" }}>⚠️ E'lon qilingandan keyin slugni o'zgartirmang (SEO).</p>}
        </div>
        <div>
          <label className="field-label">SKU (artikul)</label>
          <input className={inputCls} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="A-102" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="field-label">Narx (so'm) *</label>
          <input type="number" inputMode="numeric" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Eski narx (ixtiyoriy)</label>
          <input type="number" inputMode="numeric" className={inputCls} value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Min. buyurtma</label>
          <input type="number" inputMode="numeric" min={1} className={inputCls} value={minOrderQty} onChange={(e) => setMinOrderQty(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label">Materiali (UZ)</label>
          <input className={inputCls} value={materialUz} onChange={(e) => setMaterialUz(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Materiali (RU)</label>
          <input className={inputCls} value={materialRu} onChange={(e) => setMaterialRu(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Tavsif (UZ)</label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={descriptionUz} onChange={(e) => setDescriptionUz(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Tavsif (RU)</label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={descriptionRu} onChange={(e) => setDescriptionRu(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="field-label">Kategoriya *</label>
          <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameUz}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Holati</label>
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as ProductInitial["status"])}>
            <option value="ACTIVE">Sotuvda (ACTIVE)</option>
            <option value="SOLD_OUT">Sotilgan (SOLD_OUT)</option>
            <option value="HIDDEN">Yashirin (HIDDEN)</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2 text-sm font-medium">
            <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
            "Yangi" belgisi
          </label>
        </div>
      </div>

      <fieldset>
        <legend className="field-label">O'lchamlar *</legend>
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((s) => {
            const active = sizes.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSize(s)} aria-pressed={active}
                className="min-w-[44px] rounded-full border px-3 py-2 text-sm font-medium"
                style={{ borderColor: active ? "var(--color-gold)" : "var(--color-line)", background: active ? "var(--color-gold)" : "#fff" }}>
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Images */}
      <div>
        <label className="field-label">Rasmlar (birinchisi asosiy, {images.length}/10)</label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <div key={img.fileName} className="card p-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[var(--color-ivory-deep)]">
                <Image loader={productImageLoader} src={imageUrl(img.fileName, "sm", "webp")} alt="" fill sizes="200px" className="object-cover" />
                {i === 0 && <span className="badge badge-new absolute left-1 top-1">Asosiy</span>}
              </div>
              <div className="mt-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded border px-2 py-1 text-xs disabled:opacity-40">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded border px-2 py-1 text-xs disabled:opacity-40">↓</button>
                </div>
                <button type="button" onClick={() => removeImage(i)} className="rounded border px-2 py-1 text-xs" style={{ color: "#b91c1c" }}>O'chirish</button>
              </div>
              <input className="field-input mt-2 text-xs" placeholder="Alt (UZ)" value={img.altUz} onChange={(e) => setAlt(i, "altUz", e.target.value)} />
              <input className="field-input mt-1 text-xs" placeholder="Alt (RU)" value={img.altRu} onChange={(e) => setAlt(i, "altRu", e.target.value)} />
            </div>
          ))}
        </div>
        <label className="btn btn-outline mt-3 cursor-pointer">
          {uploading ? "Yuklanmoqda…" : "＋ Rasm qo'shish"}
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t pt-5" style={{ borderColor: "var(--color-line)" }}>
        <button type="button" onClick={() => submit(false)} disabled={saving} className="btn btn-primary">
          {saving && !posting ? "Saqlanmoqda…" : isEdit ? "Saqlash" : "Saqlash (kanalga avtomatik 📣)"}
        </button>
        {!isEdit && images.length === 0 && (
          <p className="self-center text-xs" style={{ color: "var(--color-muted)" }}>
            Kanalga joylash uchun kamida 1 ta rasm qo&apos;shing
          </p>
        )}
        {isEdit && !alreadyPosted && (
          <button type="button" onClick={() => submit(true)} disabled={saving} className="btn btn-gold" title="Kanalga birinchi marta joylash">
            {posting ? "Joylanmoqda…" : "Kanalga joylash 📣"}
          </button>
        )}
        {isEdit && alreadyPosted && (
          <button type="button" onClick={repost} disabled={posting} className="btn btn-outline" title="Kanalga qayta e'lon qilish">
            {posting ? "Joylanmoqda…" : "Qayta e'lon qilish 🔁"}
          </button>
        )}
      </div>
    </div>
  );
}
