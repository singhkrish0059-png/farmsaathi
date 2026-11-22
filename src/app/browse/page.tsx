"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useT } from "@/lib/i18n";
export default function Browse() {
  const sp = useSearchParams(); const { t } = useT();
  const [q, setQ] = useState(sp.get("q") ?? ""), [district, setDistrict] = useState(sp.get("district") ?? ""), [category, setCategory] = useState(sp.get("category") ?? ""),
    [maxPrice, setMax] = useState(""), [sort, setSort] = useState("new");
  const [items, setItems] = useState<any[] | null>(null), [err, setErr] = useState(false);
  useEffect(() => { // debounced, database-backed search
    setItems(null); setErr(false);
    const id = setTimeout(async () => {
      try { const r = await fetch("/api/products?" + new URLSearchParams({ q, district, category, maxPrice, sort })); if (!r.ok) throw 0; setItems(await r.json()); } catch { setErr(true); }
    }, 350);
    return () => clearTimeout(id);
  }, [q, district, category, maxPrice, sort]);
  return (<>
    <div className="grid md:grid-cols-5 gap-2 mb-6">
      <input className="inp md:col-span-2" placeholder={t("search")} value={q} onChange={(e) => setQ(e.target.value)} />
      <select className="inp" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{["Grains", "Fruits", "Vegetables", "Seeds", "Natural Fertilizers", "Organic Products", "Other Farm Products"].map((c) => <option key={c}>{c}</option>)}</select>
      <input className="inp" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
      <select className="inp" value={sort} onChange={(e) => setSort(e.target.value)}><option value="new">Newest</option><option value="price">Lowest price</option></select>
      <input className="inp" type="number" placeholder="Max price ₹" value={maxPrice} onChange={(e) => setMax(e.target.value)} />
    </div>
    {err ? <p>{t("error")}</p> : items === null ? <p>{t("loading")}</p> : items.length === 0 ? <p>No farmers or products found. {t("empty")}</p>
      : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </>);
}
