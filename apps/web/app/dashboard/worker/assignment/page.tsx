"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { SectionHeader, ProgressBar, Spinner, EmptyState } from "@/components/ui";
import { useActiveAssignment } from "@/hooks/useApi";

export default function WorkerAssignmentPage() {
  const { data: assignment, isLoading } = useActiveAssignment();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Worker" title="Current assignment" />
      {isLoading ? <Spinner /> : !assignment ? (
        <EmptyState message="No active assignment. The platform will assign you soon." />
      ) : (
        <div className="card p-5 max-w-lg">
          <p className="text-sm font-medium mb-1">{assignment.project?.title}</p>
          <p className="text-xs text-gray-400 mb-3">{assignment.taskDescription}</p>
          <ProgressBar value={assignment.progressPercent} />
          <p className="text-xs text-gray-400 mt-1">{assignment.progressPercent}% complete</p>
        </div>
      )}
    </DashboardLayout>
  );
}
