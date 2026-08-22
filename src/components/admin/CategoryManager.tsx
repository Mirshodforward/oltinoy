"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCategory, deleteCategory } from "@/app/(admin)/admin/(protected)/kategoriyalar/actions";
import { AlertCircle, Check, Folder, Plus, Trash, categoryIcon } from "@/components/ui/icons";

export type CategoryItem = {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

/**
 * One editable category — an existing one when `item` is given, the "add"
 * form when it is not. Both are the same card so the page reads as a stack of
 * equal things rather than a table with an odd row bolted underneath.
 */
function Row({ item, onDone }: { item?: CategoryItem; onDone: () => void }) {
  const uid = useId();
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [nameUz, setNameUz] = useState(item?.nameUz ?? "");
  const [nameRu, setNameRu] = useState(item?.nameRu ?? "");
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true);
    setError("");
    const res = await saveCategory({
      ...(item ? { id: item.id } : {}),
      slug,
      nameUz,
      nameRu,
      sortOrder: parseInt(sortOrder || "0", 10),
      isActive,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Xatolik");
      return;
    }
    if (!item) {
      setSlug("");
      setNameUz("");
      setNameRu("");
      setSortOrder("0");
    }
    onDone();
  }

  async function remove() {
    if (!item) return;
    if (!confirm("Kategoriyani o'chirasizmi?")) return;
    setBusy(true);
    const res = await deleteCategory(item.id);
    setBusy(false);
    if (!res.ok) setError(res.error ?? "Xatolik");
    else onDone();
  }

  const Icon = item ? categoryIcon(item.slug) : Plus;

  return (
    <section className="card p-5">
      {/* ───────────────── Card head: what this row is ───────────────── */}
      <header className="flex flex-wrap items-center gap-3">
        <span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border"
          style={{ borderColor: "var(--line)", color: "var(--color-gold-dk)" }}
        >
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg">{item ? item.nameUz : "Yangi kategoriya"}</h2>
          {item && (
            <p className="text-xs" style={{ color: "var(--fg-subtle)" }}>
              {item.productCount} ta mahsulot
            </p>
          )}
        </div>
        {item && !item.isActive && <span className="badge badge-soft">Yashirin</span>}
      </header>

      <div className="hairline my-4" />

      {/* ───────────────────────── Fields ───────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={`${uid}-slug`}>
            Slug
          </label>
          <input
            id={`${uid}-slug`}
            name="slug"
            className="field-input"
            placeholder="abaya"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor={`${uid}-sortOrder`}>
            Tartib
          </label>
          <input
            id={`${uid}-sortOrder`}
            name="sortOrder"
            type="number"
            inputMode="numeric"
            className="field-input"
            placeholder="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor={`${uid}-nameUz`}>
            Nomi (UZ)
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
            Nomi (RU)
          </label>
          <input
            id={`${uid}-nameRu`}
            name="nameRu"
            className="field-input"
            value={nameRu}
            onChange={(e) => setNameRu(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="field-error">
          <AlertCircle size={14} className="flex-none" />
          {error}
        </p>
      )}

      {/* ───────────────────── Visibility + actions ───────────────────── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={`${uid}-isActive`} className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            id={`${uid}-isActive`}
            name="isActive"
            type="checkbox"
            className="peer sr-only"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span
            aria-hidden="true"
            className="flex h-6 w-6 flex-none items-center justify-center rounded-xs border border-sand bg-paper text-transparent transition-colors duration-200 peer-checked:border-gold peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold"
          >
            <Check size={15} />
          </span>
          <span className="text-sm font-semibold">Aktiv</span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={save} disabled={busy} className="btn btn-primary btn-sm">
            {item ? (
              "Saqlash"
            ) : (
              <>
                <Plus size={16} />
                Qo&apos;shish
              </>
            )}
          </button>
          {item && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              aria-label={`${item.nameUz} kategoriyasini o'chirish`}
              className="btn btn-sm border-danger/40 text-danger transition-colors duration-200 hover:bg-danger hover:text-ivory"
            >
              <Trash size={16} />
              O&apos;chirish
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function CategoryManager({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <Folder size={28} className="mx-auto text-gold" />
          <p className="mx-auto mt-3 max-w-sm text-sm" style={{ color: "var(--fg-muted)" }}>
            Hozircha kategoriya yo&apos;q — quyida birinchisini qo&apos;shing.
          </p>
        </div>
      ) : (
        categories.map((c) => <Row key={c.id} item={c} onDone={refresh} />)
      )}

      <div className="seam mt-8" aria-hidden="true" />
      <Row onDone={refresh} />
    </div>
  );
}
