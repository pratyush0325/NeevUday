"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useNgoProfile } from "@/hooks/useApi";

export default function NgoWorkersPage() {
  const { data: profile, isLoading } = useNgoProfile();
  const assignments = (profile as any)?.workerAssignments ?? [];
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="NGO" title="Assigned workers" />
      <div className="card p-5">
        {isLoading ? <Spinner /> : !assignments.length ? <EmptyState message="No workers assigned yet." /> : (
          <div className="divide-y divide-gray-50">
            {assignments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{a.workerProfile?.user?.name ?? "Worker"}</p>
                  <p className="text-xs text-gray-400">{a.taskDescription}</p>
                </div>
                <Badge value={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
