"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { SectionHeader, ProgressBar, Spinner, EmptyState } from "@/components/ui";
import { useNgoProfile } from "@/hooks/useApi";

export default function NgoProjectsPage() {
  const { data: profile, isLoading } = useNgoProfile();
  const projects = (profile as any)?.projects ?? [];
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="NGO" title="Projects" />
      {isLoading ? <Spinner /> : !projects.length ? (
        <EmptyState message="No projects yet. Create one from Overview." />
      ) : (
        <div className="space-y-3">
          {projects.map((p: any) => (
            <div key={p.id} className="card p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.location}</p>
                </div>
                <span className="text-xs text-gray-400">{p.progressPercent}%</span>
              </div>
              <ProgressBar value={p.progressPercent} />
              <p className="text-xs text-gray-400 mt-1">{p.workersNeeded} workers needed</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
