"use client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useMatchSuggestions, useMatchDonation } from "@/hooks/useApi";

export default function PlatformMatchingPage() {
  const { data: suggestions, isLoading } = useMatchSuggestions();
  const match = useMatchDonation();
  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Platform" title="Match donations to villages" />
      <div className="card p-5">
        {isLoading ? <Spinner /> : !suggestions?.length ? <EmptyState message="No pending matches." /> : (
          <div className="divide-y divide-gray-50">
            {suggestions.map((s) => (
              <div key={s.donationId} className="flex items-center justify-between py-3 gap-3">
                <div>
                  <p className="text-sm font-medium">{s.donationItem} ({s.donationQuantity} units)</p>
                  <p className="text-xs text-gray-400">→ {s.villageName}, {s.villageState}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={s.urgency} />
                  <button onClick={() => match.mutate({ donationId: s.donationId, villageRequestId: s.villageRequestId })}
                    className="btn-primary text-xs py-1 px-3">Confirm match</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
