import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import EnquiryForm from "@/components/EnquiryForm";
import { wa } from "@/lib/utils";
export default async function ProductPage({ params }: { params: { id: string } }) {
  const p = await db.product.findUnique({ where: { id: params.id }, include: { category: true, farmer: { include: { user: { select: { name: true, phone: true } } } } } });
  if (!p || p.farmer.verificationStatus !== "VERIFIED") notFound();
  const ph = p.farmer.user.phone;
  return (<div className="grid md:grid-cols-2 gap-8">
    <div className="grid gap-2">{p.images.length ? p.images.map((s) => <img key={s} src={s} alt={p.name} className="rounded-2xl" />) : <div className="h-64 rounded-2xl bg-leaf flex items-center justify-center text-6xl">🌾</div>}</div>
    <div className="grid gap-3 content-start">
      <h1 className="text-3xl font-bold">{p.name}</h1>
      <p className="text-2xl text-paddy font-semibold">₹{p.price} / {p.unit}</p>
      <p>Available: {p.quantityAvailable} {p.unit} · {p.location}</p><p>{p.description}</p>
      <div className="card"><p className="font-bold">{p.farmer.user.name} <span className="text-paddy">Verified Farmer ✓</span></p><p>{p.farmer.village}, {p.farmer.district}, {p.farmer.state}</p></div>
      <div className="grid grid-cols-2 gap-2"><a className="btn" href={wa(ph, p.name)} target="_blank" rel="noopener">WhatsApp Farmer</a><a className="btn2" href={`tel:${ph}`}>Call Farmer</a></div>
      <EnquiryForm productId={p.id} name={p.name} />
    </div></div>);
}
