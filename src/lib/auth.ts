import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);
export type Session = { id: string; role: "BUYER" | "FARMER" | "ADMIN" };
export async function setSession(s: Session) {
  const t = await new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());
  cookies().set("fs_session", t, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 604800 });
}
export async function getSession(): Promise<Session | null> {
  const t = cookies().get("fs_session")?.value; if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return { id: payload.id as string, role: payload.role as Session["role"] }; } catch { return null; }
}
// Server-side role check. Returns the session or throws a Response.
export async function requireRole(...roles: Session["role"][]) {
  const s = await getSession();
  if (!s) throw Response.json({ error: "Please log in." }, { status: 401 });
  if (!roles.includes(s.role)) throw Response.json({ error: "Not allowed." }, { status: 403 });
  return s;
}
export async function requireVerifiedFarmer() {
  const s = await requireRole("FARMER");
  const f = await db.farmerProfile.findUnique({ where: { userId: s.id } });
  if (!f || f.verificationStatus !== "VERIFIED") throw Response.json({ error: "Your account is not verified yet." }, { status: 403 });
  return { s, farmer: f };
}
// Wrap handlers so thrown Responses become replies.
export const handle = (fn: (req: Request, ctx: any) => Promise<Response>) => async (req: Request, ctx: any) => {
  try { return await fn(req, ctx); } catch (e) {
    if (e instanceof Response) return e;
    if (e && typeof e === "object" && "issues" in e) return Response.json({ error: "Please check the form and try again." }, { status: 400 });
    console.error(e); return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
};
