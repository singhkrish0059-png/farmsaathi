"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AddProduct({ cats }: { cats: { id: string; name: string }[] }) {
  const r = useRouter(); const [note, setNote] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget;
    const res = await fetch("/api/products", { method: "POST", body: new FormData(form) });
    if (res.ok) { setNote("Product added successfully."); form.reset(); r.refresh(); } else setNote((await res.json()).error ?? "Something went wrong. Please try again.");
  }
  return (<form onSubmit={go} className="card grid gap-2"><h2 className="font-bold text-xl">Add Product</h2>
    <input name="name" className="inp" placeholder="Product name" required /><select name="categoryId" className="inp" required>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <textarea name="description" className="inp" placeholder="Description" required /><div className="grid grid-cols-3 gap-2"><input name="price" type="number" step="0.01" className="inp" placeholder="₹ Price" required /><input name="unit" className="inp" placeholder="kg" required /><input name="quantityAvailable" type="number" className="inp" placeholder="Qty" required /></div>
    <input name="location" className="inp" placeholder="Location" required /><input name="images" type="file" accept="image/*" multiple className="inp" /><button className="btn">Add Product</button>{note && <p role="status">{note}</p>}</form>);
}
