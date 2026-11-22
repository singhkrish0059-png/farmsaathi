import { cookies } from "next/headers";
export async function POST() { cookies().delete("fs_session"); return Response.json({ ok: true }); }
