"use client";
import { useState } from "react";
export default function EnquiryForm({ productId, name }: { productId: string; name: string }) {
  const [msg, setMsg] = useState(`I would like to purchase some ${name}. Is it currently available?`); const [note, setNote] = useState("");
  async function send() {
    const r = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, message: msg }) });
    if (r.status === 401) return (location.href = "/login");
    setNote(r.ok ? "Enquiry sent. The farmer will contact you." : (await r.json()).error ?? "Something went wrong. Please try again.");
  }
  return <div className="grid gap-2"><textarea className="inp" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} /><button className="btn" onClick={send}>Send Enquiry</button>{note && <p role="status">{note}</p>}</div>;
}
