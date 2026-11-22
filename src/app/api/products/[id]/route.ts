import { db } from "@/lib/db";
import { handle, requireRole } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { clean } from "@/lib/security";
// Owner (or admin) is checked on the server for every change.
async function owned(id: string) {
  const s = await requireRole("FARMER", "ADMIN");
  const p = await db.product.findUnique({ where: { id }, include: { farmer: true } });
  if (!p) throw Response.json({ error: "Product not found." }, { status: 404 });
  if (s.role === "FARMER" && p.farmer.userId !== s.id) throw Response.json({ error: "Not allowed." }, { status: 403 });
  return { s, p };
}
export const PATCH = handle(async (req, { params }) => {
  const { p } = await owned(params.id);
  const d = productSchema.partial().omit({ images: true }).parse(await req.json());
  return Response.json(await db.product.update({ where: { id: p.id }, data: { ...d, ...(d.name && { name: clean(d.name) }), ...(d.description && { description: clean(d.description) }) } }));
});
export const DELETE = handle(async (_req, { params }) => {
  const { s, p } = await owned(params.id);
  await db.product.delete({ where: { id: p.id } });
  if (s.role === "ADMIN") await db.adminAction.create({ data: { adminId: s.id, action: "REMOVE_PRODUCT", targetType: "Product", targetId: p.id } });
  return Response.json({ ok: true });
});
