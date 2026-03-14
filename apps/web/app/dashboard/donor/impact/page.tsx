"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { MetricCard, SectionHeader } from "@/components/ui";
import { useDonorStats } from "@/hooks/useApi";

export default function DonorImpactPage() {
  const { data: stats } = useDonorStats();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Donor" title="Your impact" />
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Total donated" value={stats?.total ?? 0} />
        <MetricCard label="Delivered" value={stats?.delivered ?? 0} sub="Confirmed" />
        <MetricCard label="Villages reached" value={stats?.villagesReached ?? 0} sub="Via your goods" />
      </div>
    </DashboardLayout>
  );
}
