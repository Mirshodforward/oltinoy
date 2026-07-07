import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="max-w-4xl">
      <Link href="/admin/postlar" className="text-sm" style={{ color: "var(--color-bronze)" }}>
        ← Postlar
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Yangi post</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
