import { db } from "@/lib/db";
import { handle, requireVerifiedFarmer } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { clean } from "@/lib/security";
import { saveFile } from "@/lib/storage";
import { Prisma } from "@prisma/client";
// Public search: name, category, farmer, village, district, state + filters + sort.
export const GET = handle(async (req) => {
  const p = new URL(req.url).searchParams;
  const q = p.get("q")?.trim(), district = p.get("district"), cat = p.get("category"), max = Number(p.get("maxPrice")) || undefined;
  const where: Prisma.ProductWhereInput = {
    availabilityStatus: "AVAILABLE", farmer: { verificationStatus: "VERIFIED", ...(district && { district: { equals: district, mode: "insensitive" } }) },
    ...(cat && { category: { name: cat } }), ...(max && { price: { lte: max } }),
    ...(q && { OR: [
      { name: { contains: q, mode: "insensitive" } }, { category: { name: { contains: q, mode: "insensitive" } } },
      { farmer: { user: { name: { contains: q, mode: "insensitive" } } } }, { farmer: { village: { contains: q, mode: "insensitive" } } },
      { farmer: { district: { contains: q, mode: "insensitive" } } }, { farmer: { state: { contains: q, mode: "insensitive" } } }] }) };
  const sort = p.get("sort") === "price" ? { price: "asc" as const } : { createdAt: "desc" as const };
  const items = await db.product.findMany({ where, orderBy: sort, take: 60, include: { category: true, farmer: { include: { user: { select: { name: true } } } } } });
  // never expose the private verification document path
  return Response.json(items.map(({ farmer: { verificationDocument, ...f }, ...i }) => ({ ...i, farmer: f })));
});
export const POST = handle(async (req) => {
  const { farmer } = await requireVerifiedFarmer(); // unverified farmers cannot publish
  const fd = await req.formData();
  const imgs = await Promise.all(fd.getAll("images").filter((f): f is File => f instanceof File && f.size > 0).slice(0, 6).map((f) => saveFile(f, "public")));
  const d = productSchema.parse({ ...Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")), images: imgs });
  const product = await db.product.create({ data: { ...d, name: clean(d.name), description: clean(d.description), location: clean(d.location), farmerId: farmer.id } });
  return Response.json(product, { status: 201 });
});
