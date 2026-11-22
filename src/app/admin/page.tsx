import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AdminButtons from "@/components/AdminButtons";
export default async function Admin() {
  const s = await getSession(); if (s?.role !== "ADMIN") redirect("/login"); // server-side guard
  const [users, farmers, verified, pending, products, enquiries, complaints, apps] = await Promise.all([
    db.user.count(), db.farmerProfile.count(), db.farmerProfile.count({ where: { verificationStatus: "VERIFIED" } }), db.farmerProfile.count({ where: { verificationStatus: "PENDING" } }),
    db.product.count(), db.enquiry.count(), db.complaint.count(), db.farmerProfile.findMany({ where: { verificationStatus: "PENDING" }, include: { user: true }, orderBy: { createdAt: "asc" } })]);
  return (<div className="grid gap-6"><h1 className="text-2xl font-bold">Admin dashboard</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Object.entries({ Users: users, Farmers: farmers, Verified: verified, Pending: pending, Products: products, Enquiries: enquiries, Complaints: complaints }).map(([k, v]) => <div key={k} className="card text-center"><b className="text-2xl">{v}</b><br />{k}</div>)}</div>
    <section><h2 className="font-bold text-xl mb-2">Pending applications</h2>{apps.length === 0 ? <p>No pending applications.</p> : apps.map((a) => <div key={a.id} className="card mb-2 grid gap-2"><b>{a.user.name}</b><p>{a.village}, {a.district} · {a.farmingType} · Applied {a.createdAt.toLocaleDateString("en-IN")}</p><AdminButtons id={a.id} /></div>)}</section></div>);
}
