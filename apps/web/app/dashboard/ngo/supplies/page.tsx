"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { SectionHeader, EmptyState } from "@/components/ui";

export default function NgoSuppliesPage() {
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="NGO" title="Incoming supplies" />
      <div className="card p-5"><EmptyState message="Supply tracking coming soon." /></div>
    </DashboardLayout>
  );
}
