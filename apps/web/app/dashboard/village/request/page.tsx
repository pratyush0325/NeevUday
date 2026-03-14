"use client";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { SectionHeader } from "@/components/ui";
import { useCreateVillageRequest } from "@/hooks/useApi";
import { useState } from "react";
import { RequestType, RequestUrgency } from "@setu/shared";

const REQUEST_TYPES: RequestType[] = ["food", "clothing", "medical", "volunteers", "infrastructure", "education"];
const URGENCIES: RequestUrgency[] = ["critical", "high", "medium", "low"];

export default function VillageNewRequestPage() {
  const createRequest = useCreateVillageRequest();
  const router = useRouter();
  const [form, setForm] = useState({ requestType: "food" as RequestType, urgency: "high" as RequestUrgency, quantity: "", familiesAffected: "", requiredBy: "", details: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRequest.mutateAsync({ ...form, quantity: parseInt(form.quantity), familiesAffected: parseInt(form.familiesAffected) });
    router.push("/dashboard/village/requests");
  };

  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Village" title="New community request" />
      <div className="card p-5 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Request type</label>
              <select className="select" value={form.requestType} onChange={(e) => setForm(f => ({ ...f, requestType: e.target.value as RequestType }))}>
                {REQUEST_TYPES.map(t => <option key={t}>{t}</option>)}
              </select></div>
            <div><label className="label">Urgency</label>
              <select className="select" value={form.urgency} onChange={(e) => setForm(f => ({ ...f, urgency: e.target.value as RequestUrgency }))}>
                {URGENCIES.map(u => <option key={u}>{u}</option>)}
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Quantity</label>
              <input className="input" type="number" min="1" value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))} /></div>
            <div><label className="label">Families affected</label>
              <input className="input" type="number" min="1" value={form.familiesAffected} onChange={(e) => setForm(f => ({ ...f, familiesAffected: e.target.value }))} /></div>
          </div>
          <div><label className="label">Required by</label>
            <input className="input" type="date" value={form.requiredBy} onChange={(e) => setForm(f => ({ ...f, requiredBy: e.target.value }))} required /></div>
          <div><label className="label">Details</label>
            <textarea className="input" rows={3} value={form.details} onChange={(e) => setForm(f => ({ ...f, details: e.target.value }))} /></div>
          <button type="submit" disabled={createRequest.isPending} className="btn-primary w-full justify-center">
            {createRequest.isPending ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
