import { z } from "zod";

/**
 * The collector's wire format. Keys are one or two characters because this
 * payload is sent from every page — over a year of traffic the short names are
 * measurably cheaper than the readability they cost, and the schema below is
 * the single place anyone needs to look them up.
 */

const str = (max: number) => z.string().max(max);

export const eventSchema = z.object({
  k: z.enum(["pageview", "click", "custom"]), // kind
  n: str(160), //                                name / label
  p: str(400), //                                path
  pid: z.number().int().positive().nullish(), // product id
  m: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).nullish(), // meta
});

export const batchSchema = z.object({
  v: z.literal(1),
  sid: str(64), //  session id
  vid: str(64), //  visitor id
  sd: z.number().int().min(0).max(24 * 60 * 60).default(0), // session duration, seconds
  ctx: z.object({
    r: str(600).nullish(), //  referrer
    u: str(600), //            landing url
    sw: z.number().int().min(0).max(20000).nullish(), // screen width
    l: str(12).nullish(), //   locale
  }),
  e: z.array(eventSchema).min(1).max(40),
});

export type Batch = z.infer<typeof batchSchema>;
export type WireEvent = z.infer<typeof eventSchema>;
