import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getPlatformStats = async (_req: AuthRequest, res: Response) => {
  const [
    pendingMatches,
    activeNgos,
    openVillageRequests,
    workersAssigned,
    villagesServed,
  ] = await Promise.all([
    prisma.donation.count({ where: { status: "queued" } }),
    prisma.ngoProfile.count({ where: { verificationStatus: "approved" } }),
    prisma.villageRequest.count({ where: { status: "pending" } }),
    prisma.workerProfile.count({ where: { status: "assigned" } }),
    prisma.villageProfile.count({
      where: { requests: { some: { status: { in: ["matched", "in_transit", "fulfilled"] } } } },
    }),
  ]);

  return res.json({
    success: true,
    data: { pendingMatches, activeNgos, openVillageRequests, workersAssigned, villagesServed },
  });
};

// Simple matching engine: suggest donation <-> village request pairings
export const getMatchSuggestions = async (_req: AuthRequest, res: Response) => {
  const [queuedDonations, pendingRequests] = await Promise.all([
    prisma.donation.findMany({ where: { status: "queued" }, take: 20 }),
    prisma.villageRequest.findMany({
      where: { status: "pending" },
      include: { villageProfile: true },
      orderBy: { urgency: "asc" },
      take: 20,
    }),
  ]);

  const categoryToRequestType: Record<string, string[]> = {
    food: ["food"],
    clothing: ["clothing"],
    medical: ["medical"],
    infrastructure: ["infrastructure"],
    other: ["volunteers", "education"],
  };

  const suggestions = [];
  for (const donation of queuedDonations) {
    const compatibleTypes = categoryToRequestType[donation.category] || [];
    const match = pendingRequests.find((r) =>
      compatibleTypes.includes(r.requestType) && !suggestions.find((s) => s.villageRequestId === r.id)
    );
    if (match) {
      suggestions.push({
        donationId: donation.id,
        donationItem: donation.itemName,
        donationQuantity: donation.quantity,
        villageRequestId: match.id,
        villageName: match.villageProfile.villageName,
        villageState: match.villageProfile.state,
        urgency: match.urgency,
        compatibilityScore: match.urgency === "critical" ? 100 : match.urgency === "high" ? 80 : 60,
      });
    }
  }

  return res.json({ success: true, data: suggestions });
};
