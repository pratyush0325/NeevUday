"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { SectionHeader, Spinner } from "@/components/ui";
import { useWorkerProfile } from "@/hooks/useApi";

export default function WorkerProfilePage() {
  const { data: profile, isLoading } = useWorkerProfile();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Worker" title="My profile" />
      {isLoading ? <Spinner /> : (
        <div className="card p-5 max-w-md">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">Location</dt><dd>{profile?.location ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Preferred work</dt><dd>{profile?.preferredWork ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Rating</dt><dd>{profile?.rating?.toFixed(1) ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Days worked</dt><dd>{profile?.daysWorked ?? 0}</dd></div>
          </dl>
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {profile?.skills?.map((s: string) => (
                <span key={s} className="text-xs bg-ocean-50 text-ocean-800 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
