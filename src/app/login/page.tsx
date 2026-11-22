"use client";
import { useState } from "react";
export default function Login() {
  const [err, setErr] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
    const d = await r.json(); if (!r.ok) return setErr(d.error ?? "Something went wrong. Please try again.");
    location.href = d.role === "ADMIN" ? "/admin" : d.role === "FARMER" ? "/dashboard" : "/browse";
  }
  return <form onSubmit={go} className="max-w-sm mx-auto grid gap-3"><h1 className="text-2xl font-bold">Login</h1><input name="email" type="email" className="inp" placeholder="Email" required /><input name="password" type="password" className="inp" placeholder="Password" required />{err && <p role="alert">{err}</p>}<button className="btn">Login</button></form>;
}
