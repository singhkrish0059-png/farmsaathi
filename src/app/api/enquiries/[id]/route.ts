import { z } from "zod";
import { db } from "@/lib/db";
import { handle, requireRole } from "@/lib/auth";
export const PATCH = handle(async (req, { params }) => {
  const s = await requireRole("FARMER");
  const { status } = z.object({ status: z.enum(["CONTACTED", "CLOSED"]) }).parse(await req.json());
  const e = await db.enquiry.findUnique({ where: { id: params.id }, include: { farmer: true } });
  if (!e || e.farmer.userId !== s.id) return Response.json({ error: "Not allowed." }, { status: 403 });
  return Response.json(await db.enquiry.update({ where: { id: e.id }, data: { status } }));
});
