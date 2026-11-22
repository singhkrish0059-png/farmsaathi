import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { setSession, handle } from "@/lib/auth";
import { rateLimit, ip } from "@/lib/security";
export const POST = handle(async (req) => {
  rateLimit("login" + ip(req), 8);
  const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(await req.json());
  const u = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return Response.json({ error: "Email or password is wrong." }, { status: 401 });
  await setSession({ id: u.id, role: u.role });
  return Response.json({ ok: true, role: u.role });
});
