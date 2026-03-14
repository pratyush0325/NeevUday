"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useMyVillageRequests } from "@/hooks/useApi";

export default function VillageRequestsPage() {
  const { data: requests, isLoading } = useMyVillageRequests();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Village" title="My requests" />
      <div className="card p-5">
        {isLoading ? <Spinner /> : !requests?.length ? <EmptyState message="No requests yet." /> : (
          <div className="divide-y divide-gray-50">
            {requests.map((r) => (
              <div key={r.id} className="flex items-start justify-between py-3 gap-3">
                <div>
                  <p className="text-sm font-medium capitalize">{r.requestType} — {r.quantity} units</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.familiesAffected} families · Due {new Date(r.requiredBy).toLocaleDateString("en-IN")}</p>
                  {r.details && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.details}</p>}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <Badge value={r.status} /><Badge value={r.urgency} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
