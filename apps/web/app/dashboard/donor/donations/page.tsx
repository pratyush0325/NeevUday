"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Badge, SectionHeader, Spinner, EmptyState } from "@/components/ui";
import { useMyDonations } from "@/hooks/useApi";

export default function DonorDonationsPage() {
  const { data: donations, isLoading } = useMyDonations();

  return (
    <DashboardLayout>
      <SectionHeader eyebrow="Donor" title="All donations" />

      <div className="card p-5">
        {isLoading ? (
          <Spinner />
        ) : !donations?.length ? (
          <EmptyState message="No donations yet. Go to Overview to submit one." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Item</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Category</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Quantity</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Matched to</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.map((d) => (
                <tr key={d.id}>
                  <td className="py-3 font-medium">{d.itemName}</td>
                  <td className="py-3 capitalize text-gray-500">{d.category}</td>
                  <td className="py-3 text-gray-500">{d.quantity} {d.unit}</td>
                  <td className="py-3 text-gray-500">
                    {d.matchedNgoName ?? d.matchedVillageName ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3"><Badge value={d.status} /></td>
                  <td className="py-3 text-gray-400 text-xs">
                    {new Date(d.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
