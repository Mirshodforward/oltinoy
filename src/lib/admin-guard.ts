import { auth } from "@/auth";

/** Throws if the caller is not an authenticated admin. Use in server actions. */
export async function requireAdmin(): Promise<{ id: string; name: string }> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return { id: session.user.id ?? "", name: session.user.name ?? "admin" };
}
