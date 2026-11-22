import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
// Storage abstraction: swap these two functions for S3/Cloudinary later.
const OK = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" } as Record<string, string>;
export async function saveFile(file: File, kind: "public" | "private", allowPdf = false) {
  const ext = OK[file.type];
  if (!ext || (ext === "pdf" && !allowPdf)) throw Response.json({ error: "Only JPG, PNG, WebP (or PDF for documents)." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) throw Response.json({ error: "File must be under 5 MB." }, { status: 400 });
  const name = `${crypto.randomUUID()}.${ext}`;
  const dir = kind === "public" ? path.join(process.cwd(), "public/uploads") : path.join(process.cwd(), "private-uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return kind === "public" ? `/uploads/${name}` : name;
}
export const readPrivate = (name: string) => fs.readFile(path.join(process.cwd(), "private-uploads", path.basename(name)));
