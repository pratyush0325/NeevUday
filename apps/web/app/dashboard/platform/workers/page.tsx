"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useAvailableWorkers } from "@/hooks/useApi";

export default function PlatformWorkersPage() {
  const { data: workers, isLoading } = useAvailableWorkers();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Platform" title="Available workers" />
      <div className="card p-5">
        {isLoading ? <Spinner /> : !workers?.length ? <EmptyState message="No available workers." /> : (
          <div className="divide-y divide-gray-50">
            {workers.map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{w.name}</p>
                  <p className="text-xs text-gray-400">{w.location} · {w.skills?.join(", ")}</p>
                </div>
                <Badge value={w.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
