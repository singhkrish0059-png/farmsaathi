"use client";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n";
export default function Home() {
  const { t } = useT(); const [q, setQ] = useState(""); const [d, setD] = useState("");
  return (<>
    <section className="rounded-3xl bg-leaf p-8 md:p-14 grid gap-5">
      <h1 className="text-4xl md:text-6xl font-bold text-paddy">{t("heroTitle")}</h1>
      <p className="text-lg max-w-xl">{t("heroSub")}</p>
      <form action="/browse" className="grid md:grid-cols-[2fr_1fr_auto] gap-2"><input name="q" className="inp" placeholder={t("search")} value={q} onChange={(e) => setQ(e.target.value)} />
        <select name="district" className="inp" value={d} onChange={(e) => setD(e.target.value)}><option value="">Select Location</option>{["Mandya", "Hassan", "Mysuru", "Tumakuru", "Dharwad", "Kodagu", "Ramanagara", "Raichur"].map((x) => <option key={x}>{x}</option>)}</select>
        <button className="btn">Search</button></form>
      <div className="flex gap-3 flex-wrap"><Link href="/browse" className="btn">{t("browse")}</Link><Link href="/register?role=FARMER" className="btn2">Sell Your Products</Link></div>
    </section>
    <section className="mt-12 grid md:grid-cols-3 gap-4">
      {[["Problem", "Farmers struggle to reach buyers directly."], ["Solution", "FarmSaathi connects verified farmers directly with buyers."], ["Impact", "Better market access, transparency, and direct communication."]].map(([h, b]) => <div key={h} className="card"><h2 className="font-bold text-paddy text-xl">{h}</h2><p>{b}</p></div>)}
    </section>
    <p className="text-center text-xl font-bold mt-8 text-paddy">FARMER → FARM-SAATHI → BUYER</p>
    <section className="mt-12 grid md:grid-cols-2 gap-6">
      {[["Buyers", ["Search: find the product you need.", "Discover: find verified farmers near you.", "Connect: contact the farmer directly."]], ["Farmers", ["Register: create your farmer profile.", "Get Verified: submit your details.", "Sell: list products and connect with buyers."]]].map(([h, s]) => <div key={h as string} className="card"><h2 className="font-bold text-xl">For {h as string}</h2><ol className="list-decimal ml-5 mt-2 grid gap-1">{(s as string[]).map((x) => <li key={x}>{x}</li>)}</ol></div>)}
    </section>
  </>);
}
