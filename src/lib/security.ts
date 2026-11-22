import sanitizeHtml from "sanitize-html";
export const clean = (s: string) => sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} }).trim();
// Simple in-memory limiter. Swap for Redis/Upstash in production.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max = 10, windowMs = 60_000) {
  const now = Date.now(); const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  if (arr.length > max) throw Response.json({ error: "Too many tries. Please wait a minute." }, { status: 429 });
}
export const ip = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
