"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useAllNgos, useUpdateNgoVerification } from "@/hooks/useApi";

export default function PlatformNgosPage() {
  const { data: ngos, isLoading } = useAllNgos();
  const verify = useUpdateNgoVerification();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Platform" title="NGO management" />
      <div className="card p-5">
        {isLoading ? <Spinner /> : !ngos?.length ? <EmptyState message="No NGOs found." /> : (
          <div className="divide-y divide-gray-50">
            {ngos.map((n) => (
              <div key={n.id} className="flex items-center justify-between py-3 gap-3">
                <div>
                  <p className="text-sm font-medium">{n.name}</p>
                  <p className="text-xs text-gray-400">{n.state} · {n.focusAreas?.join(", ")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={n.verificationStatus} />
                  {(n.verificationStatus === "pending" || n.verificationStatus === "under_review") && (
                    <>
                      <button onClick={() => verify.mutate({ ngoId: n.id, status: "approved" })}
                        className="btn-primary text-xs py-1 px-3">Approve</button>
                      <button onClick={() => verify.mutate({ ngoId: n.id, status: "rejected" })}
                        className="btn-secondary text-xs py-1 px-3">Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
