"use client";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n";
export default function Nav({ role }: { role: string | null }) {
  const { t, lang, setLang } = useT(); const [open, setOpen] = useState(false);
  const links: [string, string][] = [["/", t("home")], ["/browse", t("browse")], ["/browse?category=Natural+Fertilizers", t("fert")], ["/register?role=FARMER", t("sell")]];
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); location.href = "/"; };
  return (
    <header className="sticky top-0 z-20 bg-white/95 border-b border-paddy/15">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-xl font-bold text-paddy">FarmSaathi 🌱</Link>
        <nav className="hidden md:flex gap-6">{links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</nav>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setLang("en")} className={lang === "en" ? "font-bold" : ""}>English</button>|<button onClick={() => setLang("kn")} className={lang === "kn" ? "font-bold" : ""}>ಕನ್ನಡ</button>
          {role ? (<><Link href={role === "ADMIN" ? "/admin" : "/dashboard"}>{t("dashboard")}</Link><button onClick={logout}>{t("logout")}</button></>)
            : (<><Link href="/login">{t("login")}</Link><Link href="/register" className="btn">{t("register")}</Link></>)}
        </div>
        <button className="md:hidden text-2xl min-h-[48px] min-w-[48px]" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
      </div>
      {open && <div className="md:hidden px-4 pb-4 grid gap-3">
        {links.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="py-2">{l}</Link>)}
        <div className="flex gap-4"><button onClick={() => setLang("en")}>English</button><button onClick={() => setLang("kn")}>ಕನ್ನಡ</button></div>
        {role ? <button onClick={logout} className="btn2">{t("logout")}</button> : <Link href="/login" className="btn">{t("login")}</Link>}
      </div>}
    </header>);
}
