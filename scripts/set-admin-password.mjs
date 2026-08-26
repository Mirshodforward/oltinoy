/**
 * Sets the admin panel password from the server — the way back in when nobody
 * can reach /admin to use the in-panel form.
 *
 *   node --env-file=.env scripts/set-admin-password.mjs 'yangi-parol'
 *   node --env-file=.env scripts/set-admin-password.mjs          # kuchli parol o'ylab topadi
 */
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

/** Ambiguity-free alphabet: no O/0, no l/1 — these get read aloud over the phone. */
function generate(length = 16) {
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

const username = process.env.ADMIN_USERNAME;
if (!username) {
  console.error("❌ .env da ADMIN_USERNAME yo'q");
  process.exit(1);
}

const supplied = process.argv[2];
if (supplied && supplied.length < 8) {
  console.error("❌ Parol kamida 8 belgidan iborat bo'lsin");
  process.exit(1);
}
const password = supplied ?? generate();

const passwordHash = await bcrypt.hash(password, 12);
await db.adminUser.upsert({
  where: { username },
  create: { username, passwordHash },
  update: { passwordHash },
});
await db.$disconnect();

console.log(`✅ "${username}" uchun parol o'rnatildi.`);
if (!supplied) console.log(`   Yangi parol: ${password}`);
console.log("   Kirish: /admin/login");
