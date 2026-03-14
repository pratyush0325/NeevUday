"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { SectionHeader, EmptyState } from "@/components/ui";

export default function WorkerFindPage() {
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Worker" title="Find work" />
      <div className="card p-5"><EmptyState message="Job board coming soon." /></div>
    </DashboardLayout>
  );
}
