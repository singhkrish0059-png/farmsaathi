import { z } from "zod";
import { db } from "@/lib/db";
import { handle, requireRole } from "@/lib/auth";
export const PATCH = handle(async (req, { params }) => {
  const s = await requireRole("ADMIN");
  const d = z.object({ action: z.enum(["APPROVE", "REJECT", "SUSPEND"]), reason: z.string().max(300).optional() }).parse(await req.json());
  if (d.action === "REJECT" && !d.reason) return Response.json({ error: "Please give a reason." }, { status: 400 });
  const status = { APPROVE: "VERIFIED", REJECT: "REJECTED", SUSPEND: "SUSPENDED" }[d.action] as "VERIFIED" | "REJECTED" | "SUSPENDED";
  const f = await db.farmerProfile.update({ where: { id: params.id }, data: { verificationStatus: status, rejectionReason: d.action === "REJECT" ? d.reason : null } });
  await db.adminAction.create({ data: { adminId: s.id, action: d.action, targetType: "FarmerProfile", targetId: f.id, note: d.reason } });
  return Response.json(f);
});
