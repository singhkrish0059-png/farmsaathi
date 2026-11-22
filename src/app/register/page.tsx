"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
export default function Register() {
  const [role, setRole] = useState(useSearchParams().get("role") === "FARMER" ? "FARMER" : "BUYER"); const [step, setStep] = useState(1); const [err, setErr] = useState(""); const [done, setDone] = useState(false);
  const farmer = role === "FARMER";
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (farmer && step < 3) return setStep(step + 1);
    const fd = new FormData(e.currentTarget); fd.set("role", role);
    const r = await fetch("/api/auth/register", { method: "POST", body: fd }); const d = await r.json();
    if (!r.ok) return setErr(d.error ?? "Something went wrong. Please try again.");
    if (farmer) setDone(true); else location.href = "/browse";
  }
  if (done) return <div className="card max-w-md mx-auto"><h1 className="font-bold text-xl">Your farmer application has been submitted.</h1><p>Verification Pending. <a href="/dashboard" className="underline">Go to dashboard</a></p></div>;
  // Fields from all steps stay mounted (hidden) so one submit sends everything.
  const show = (n: number) => (!farmer ? n === 1 : step === n) ? "grid gap-3" : "hidden";
  return (<form onSubmit={submit} className="max-w-md mx-auto grid gap-4">
    <h1 className="text-2xl font-bold">{farmer ? `Farmer registration — step ${step} of 3` : "Buyer registration"}</h1>
    <div className="flex gap-2"><button type="button" className={role === "BUYER" ? "btn" : "btn2"} onClick={() => { setRole("BUYER"); setStep(1); }}>Buyer</button><button type="button" className={farmer ? "btn" : "btn2"} onClick={() => setRole("FARMER")}>Farmer</button></div>
    <div className={show(1)}><input name="name" className="inp" placeholder="Full name" required /><input name="email" type="email" className="inp" placeholder="Email" required /><input name="phone" className="inp" placeholder="Mobile number (10 digits)" required /><input name="password" type="password" minLength={8} className="inp" placeholder="Password (8+ characters)" required /></div>
    {farmer && <><div className={show(2)}><input name="village" className="inp" placeholder="Village" required /><input name="district" className="inp" placeholder="District" required /><input name="state" className="inp" placeholder="State" defaultValue="Karnataka" required /><input name="farmingType" className="inp" placeholder="Farming type (Organic, Traditional...)" required /><input name="farmingExperience" type="number" className="inp" placeholder="Years of farming" required /><textarea name="bio" className="inp" placeholder="About your farm" /></div>
      <div className={show(3)}><label>Verification document (ID or land record, JPG/PNG/PDF)<input name="document" type="file" accept="image/*,application/pdf" className="inp" /></label><label>Profile photo<input name="photo" type="file" accept="image/*" className="inp" /></label></div></>}
    {err && <p role="alert">{err}</p>}
    <div className="flex gap-2">{farmer && step > 1 && <button type="button" className="btn2" onClick={() => setStep(step - 1)}>Back</button>}<button className="btn flex-1">{farmer && step < 3 ? "Next" : "Submit"}</button></div>
  </form>);
}
