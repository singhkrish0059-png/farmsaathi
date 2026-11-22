import { db } from "@/lib/db";
import { handle, requireRole } from "@/lib/auth";
import { enquirySchema } from "@/lib/validation";
import { clean, rateLimit } from "@/lib/security";
export const POST = handle(async (req) => {
  const s = await requireRole("BUYER"); rateLimit("enq" + s.id, 10);
  const d = enquirySchema.parse(await req.json());
  const p = await db.product.findUnique({ where: { id: d.productId } });
  if (!p) return Response.json({ error: "Product not found." }, { status: 404 });
  return Response.json(await db.enquiry.create({ data: { buyerId: s.id, farmerId: p.farmerId, productId: p.id, message: clean(d.message) } }), { status: 201 });
});
export const GET = handle(async () => {
  const s = await requireRole("FARMER");
  const f = await db.farmerProfile.findUnique({ where: { userId: s.id } });
  return Response.json(await db.enquiry.findMany({ where: { farmerId: f?.id }, orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } }, buyer: { select: { name: true, phone: true } } } }));
});
