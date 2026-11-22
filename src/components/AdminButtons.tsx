"use client";
import { useRouter } from "next/navigation";
export default function AdminButtons({ id }: { id: string }) {
  const r = useRouter();
  async function act(action: string) {
    const reason = action === "REJECT" ? prompt("Reason for rejection?") ?? "" : undefined;
    if (action === "REJECT" && !reason) return;
    await fetch(`/api/admin/farmers/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, reason }) }); r.refresh();
  }
  return <div className="flex gap-2 flex-wrap"><a className="btn2" target="_blank" href={`/api/admin/documents/${id}`}>View document</a>
    <button className="btn" onClick={() => act("APPROVE")}>Approve</button><button className="btn2" onClick={() => act("REJECT")}>Reject</button><button className="btn2" onClick={() => act("SUSPEND")}>Suspend</button></div>;
}
