import { z } from "zod";

/** Booking payload — validated on both client and server (§7.2). */
export const bookingSchema = z.object({
  productId: z.number().int().positive(),
  size: z.string().min(1).max(8),
  quantity: z.number().int().min(1).max(9999),
  customerName: z.string().min(1, "name").max(120),
  phone: z
    .string()
    .transform((s) => {
      const digits = s.replace(/\D/g, "");
      let n = digits;
      if (n.startsWith("998")) n = n.slice(3);
      return n.length === 9 ? `+998${n}` : s;
    })
    .pipe(z.string().regex(/^\+998\d{9}$/, "phone")),
  tgUsername: z
    .string()
    .max(64)
    .optional()
    .transform((s) => (s ? s.replace(/^@/, "").trim() || undefined : undefined)),
  note: z.string().max(300).optional().transform((s) => s?.trim() || undefined),
  // Honeypot — must be empty. Bots fill it.
  website: z.string().optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Product image row as submitted by the admin form. */
export const productImageInput = z.object({
  fileName: z.string().min(1).max(64),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  altUz: z.string().max(160).optional().nullable(),
  altRu: z.string().max(160).optional().nullable(),
});

const PRODUCT_STATUS = ["ACTIVE", "SOLD_OUT", "HIDDEN"] as const;

/** Admin product create/update payload. */
export const productFormSchema = z.object({
  nameUz: z.string().min(1).max(200),
  nameRu: z.string().min(1).max(200),
  slug: z.string().max(220).optional().default(""),
  sku: z.string().max(40).optional().transform((s) => s?.trim() || null),
  descriptionUz: z.string().max(5000).optional().transform((s) => s?.trim() || null),
  descriptionRu: z.string().max(5000).optional().transform((s) => s?.trim() || null),
  materialUz: z.string().max(300).optional().transform((s) => s?.trim() || null),
  materialRu: z.string().max(300).optional().transform((s) => s?.trim() || null),
  price: z.number().int().min(0).max(100_000_000),
  oldPrice: z.number().int().min(0).max(100_000_000).optional().nullable(),
  sizes: z.array(z.string().max(8)).min(1),
  minOrderQty: z.number().int().min(1).max(9999).default(1),
  categoryId: z.number().int().positive(),
  status: z.enum(PRODUCT_STATUS).default("ACTIVE"),
  isNew: z.boolean().default(true),
  images: z.array(productImageInput).max(10).default([]),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

/** Blog post create/update payload. */
export const postFormSchema = z.object({
  slug: z.string().max(220).optional().default(""),
  titleUz: z.string().min(1).max(200),
  titleRu: z.string().min(1).max(200),
  excerptUz: z.string().max(400).optional().transform((s) => s?.trim() || null),
  excerptRu: z.string().max(400).optional().transform((s) => s?.trim() || null),
  contentUz: z.string().min(1),
  contentRu: z.string().min(1),
  coverImage: z.string().max(300).optional().transform((s) => s?.trim() || null),
  isPublished: z.boolean().default(false),
});
export type PostFormInput = z.infer<typeof postFormSchema>;

/** Category create/update payload. */
export const categoryFormSchema = z.object({
  slug: z.string().min(1).max(60),
  nameUz: z.string().min(1).max(100),
  nameRu: z.string().min(1).max(100),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
