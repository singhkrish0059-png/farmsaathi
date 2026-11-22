import { db } from "@/lib/db";
import { handle, requireRole } from "@/lib/auth";
import { readPrivate } from "@/lib/storage";
// Only admins can ever read verification documents.
export const GET = handle(async (_req, { params }) => {
  await requireRole("ADMIN");
  const f = await db.farmerProfile.findUnique({ where: { id: params.id } });
  if (!f?.verificationDocument) return Response.json({ error: "No document." }, { status: 404 });
  const ext = f.verificationDocument.split(".").pop();
  const type = ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return new Response(await readPrivate(f.verificationDocument), { headers: { "Content-Type": type, "Cache-Control": "private, no-store" } });
});
