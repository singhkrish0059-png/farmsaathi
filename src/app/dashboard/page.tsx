import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AddProduct from "@/components/AddProduct";
export default async function Dashboard() {
  const s = await getSession(); if (!s) redirect("/login"); if (s.role === "ADMIN") redirect("/admin");
  if (s.role === "BUYER") return <p>Welcome! <a className="underline" href="/browse">Browse products</a></p>;
  const f = await db.farmerProfile.findUnique({ where: { userId: s.id }, include: { products: true, enquiries: { orderBy: { createdAt: "desc" }, include: { product: true, buyer: true } } } });
  if (!f) redirect("/register?role=FARMER");
  const cats = await db.productCategory.findMany();
  const st = f.verificationStatus;
  return (<div className="grid gap-6">
    <div className="card"><h1 className="text-2xl font-bold">Verification: {st === "VERIFIED" ? "Verified Farmer ✓" : st === "PENDING" ? "Verification Pending" : st}</h1>
      {st === "REJECTED" && <p>Reason: {f.rejectionReason}. Upload a new document below.</p>}
      {(st === "REJECTED") && <form action="/api/farmer/verification" method="post" encType="multipart/form-data" className="flex gap-2 mt-2"><input type="file" name="document" className="inp" /><button className="btn">Resubmit</button></form>}</div>
    <div className="grid grid-cols-3 gap-3 text-center"><div className="card"><b>{f.products.length}</b><br />Products</div><div className="card"><b>{f.products.filter((p) => p.availabilityStatus === "AVAILABLE").length}</b><br />Available</div><div className="card"><b>{f.enquiries.length}</b><br />Enquiries</div></div>
    {st === "VERIFIED" ? <AddProduct cats={cats} /> : <p>You can add products after admin approval.</p>}
    <section><h2 className="font-bold text-xl mb-2">Buyer enquiries</h2>{f.enquiries.length === 0 ? <p>No enquiries yet.</p> : f.enquiries.map((e) => <div key={e.id} className="card mb-2"><b>{e.buyer.name}</b> · {e.product.name} · {e.status}<p>{e.message}</p><a className="underline" href={`tel:${e.buyer.phone}`}>Contact buyer</a></div>)}</section>
  </div>);
}
