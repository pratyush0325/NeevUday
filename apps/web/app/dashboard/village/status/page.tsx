"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useMyVillageRequests } from "@/hooks/useApi";

export default function VillageStatusPage() {
  const { data: requests, isLoading } = useMyVillageRequests();
  const active = requests?.filter(r => r.status !== "pending") ?? [];
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Village" title="Incoming aid status" />
      <div className="card p-5">
        {isLoading ? <Spinner /> : !active.length ? <EmptyState message="No active aid deliveries yet." /> : (
          <div className="divide-y divide-gray-50">
            {active.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{r.requestType} — {r.quantity} units</p>
                  <p className="text-xs text-gray-400">Updated {new Date(r.updatedAt).toLocaleDateString("en-IN")}</p>
                </div>
                <Badge value={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
