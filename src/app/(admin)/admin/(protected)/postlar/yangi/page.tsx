import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";
import { ArrowLeft } from "@/components/ui/icons";

export default function NewPostPage() {
  return (
    <div className="max-w-4xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <Link
        href="/admin/postlar"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--color-gold-dk)" }}
      >
        <ArrowLeft size={16} />
        Postlar
      </Link>

      <header className="mt-1 max-w-2xl">
        <h1 className="text-3xl">Yangi post</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Sarlavha, matn va muqova rasmi — qoralama sifatida saqlab, keyin chop etsangiz ham bo'ladi.
        </p>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}
