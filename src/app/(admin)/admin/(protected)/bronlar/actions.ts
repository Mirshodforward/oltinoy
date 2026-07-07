"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { applyBookingStatus } from "@/lib/booking-status";
import type { BookingStatus } from "@prisma/client";

export async function changeBookingStatus(id: number, status: BookingStatus) {
  const admin = await requireAdmin();
  await applyBookingStatus(id, status, admin.name);
  revalidatePath("/admin/bronlar");
  revalidatePath("/admin");
}

export async function saveAdminNote(id: number, note: string) {
  await requireAdmin();
  await db.booking.update({ where: { id }, data: { adminNote: note.slice(0, 500) } });
  revalidatePath("/admin/bronlar");
}
