"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCategory, deleteCategory } from "@/app/(admin)/admin/(protected)/kategoriyalar/actions";

export type CategoryItem = {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

function Row({ item, onDone }: { item?: CategoryItem; onDone: () => void }) {
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

  return (
    <div className="card p-3">
      <div className="grid gap-2 md:grid-cols-5">
        <input className="field-input text-sm" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="field-input text-sm" placeholder="Nomi (UZ)" value={nameUz} onChange={(e) => setNameUz(e.target.value)} />
        <input className="field-input text-sm" placeholder="Nomi (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
        <input className="field-input text-sm" type="number" placeholder="Tartib" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Aktiv
          </label>
          <button type="button" onClick={save} disabled={busy} className="btn btn-primary px-3 py-1.5 text-xs">
            {item ? "Saqlash" : "Qo'shish"}
          </button>
          {item && (
            <button type="button" onClick={remove} disabled={busy} className="rounded border px-2 py-1 text-xs" style={{ color: "#b91c1c" }}>
              🗑
            </button>
          )}
        </div>
      </div>
      {item && <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>{item.productCount} ta mahsulot</p>}
      {error && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{error}</p>}
    </div>
  );
}

export function CategoryManager({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="space-y-3">
      {categories.map((c) => (
        <Row key={c.id} item={c} onDone={refresh} />
      ))}
      <div>
        <h2 className="mb-2 mt-6 text-sm font-semibold">Yangi kategoriya</h2>
        <Row onDone={refresh} />
      </div>
    </div>
  );
}
