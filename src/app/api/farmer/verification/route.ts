import { db } from "@/lib/db";
import { handle, requireRole } from "@/lib/auth";
import { saveFile } from "@/lib/storage";
// Resubmit a document after rejection. Status goes back to PENDING.
export const POST = handle(async (req) => {
  const s = await requireRole("FARMER");
  const f = (await req.formData()).get("document");
  if (!(f instanceof File) || !f.size) return Response.json({ error: "Please choose a document." }, { status: 400 });
  const name = await saveFile(f, "private", true);
  await db.farmerProfile.update({ where: { userId: s.id }, data: { verificationDocument: name, verificationStatus: "PENDING", rejectionReason: null } });
  return Response.json({ ok: true });
});
