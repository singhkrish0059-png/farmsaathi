"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { wa } from "@/lib/utils";
export { wa };
export default function ProductCard({ p }: { p: any }) {
  const { t } = useT();
  return (
    <div className="card flex flex-col gap-2">
      <div className="h-36 rounded-xl bg-leaf flex items-center justify-center text-4xl overflow-hidden">{p.images[0] ? <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /> : "🌾"}</div>
      <h3 className="font-bold text-lg">{p.name}</h3>
      <p className="text-paddy font-semibold">₹{p.price} / {p.unit} <span className="text-soil/70 font-normal">· {p.quantityAvailable} {p.unit}</span></p>
      <p className="text-sm">{p.farmer.user.name} — {p.farmer.village}, {p.farmer.district}</p>
      <p className="text-sm text-paddy font-medium">{t("verified")}</p>
      <div className="flex gap-2 mt-auto"><Link href={`/products/${p.id}`} className="btn2 flex-1">View</Link></div>
    </div>);
}
