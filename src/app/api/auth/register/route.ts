import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setSession, handle } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { clean, rateLimit, ip } from "@/lib/security";
import { saveFile } from "@/lib/storage";
export const POST = handle(async (req) => {
  rateLimit("reg" + ip(req), 5);
  const fd = await req.formData();
  const d = registerSchema.parse(Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")));
  if (await db.user.findUnique({ where: { email: d.email.toLowerCase() } })) return Response.json({ error: "This email is already registered." }, { status: 409 });
  if (d.role === "FARMER" && (!d.village || !d.district || !d.state || !d.farmingType)) return Response.json({ error: "Please fill your farm details." }, { status: 400 });
  const doc = fd.get("document"), photo = fd.get("photo");
  const user = await db.user.create({ data: {
    name: clean(d.name), email: d.email.toLowerCase(), phone: d.phone, passwordHash: await bcrypt.hash(d.password, 12), role: d.role,
    ...(d.role === "FARMER" ? { farmer: { create: {
      village: clean(d.village!), district: clean(d.district!), state: clean(d.state!), farmingType: clean(d.farmingType!),
      farmingExperience: d.farmingExperience ?? 0, bio: clean(d.bio ?? ""),
      verificationDocument: doc instanceof File && doc.size ? await saveFile(doc, "private", true) : null,
      profileImage: photo instanceof File && photo.size ? await saveFile(photo, "public") : null } } } : {}) } });
  await setSession({ id: user.id, role: user.role });
  return Response.json({ ok: true, role: user.role });
});
