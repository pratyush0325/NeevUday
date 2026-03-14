import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { CreateDonationRequest } from "@setu/shared";

export const createDonation = async (req: AuthRequest, res: Response) => {
  const { category, itemName, quantity, unit }: CreateDonationRequest = req.body;

  const donor = await prisma.donorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!donor) return res.status(404).json({ success: false, error: "Donor profile not found" });

  const donation = await prisma.donation.create({
    data: { donorProfileId: donor.id, category, itemName, quantity, unit },
  });

  return res.status(201).json({ success: true, data: donation });
};

export const getMyDonations = async (req: AuthRequest, res: Response) => {
  const donor = await prisma.donorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!donor) return res.status(404).json({ success: false, error: "Donor profile not found" });

  const donations = await prisma.donation.findMany({
    where: { donorProfileId: donor.id },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ success: true, data: donations });
};

export const getDonorStats = async (req: AuthRequest, res: Response) => {
  const donor = await prisma.donorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!donor) return res.status(404).json({ success: false, error: "Donor profile not found" });

  const [total, active, delivered] = await Promise.all([
    prisma.donation.count({ where: { donorProfileId: donor.id } }),
    prisma.donation.count({ where: { donorProfileId: donor.id, status: { in: ["matched", "in_transit"] } } }),
    prisma.donation.count({ where: { donorProfileId: donor.id, status: "delivered" } }),
  ]);

  const uniqueVillages = await prisma.donation.groupBy({
    by: ["matchedVillageId"],
    where: { donorProfileId: donor.id, matchedVillageId: { not: null } },
  });

  return res.json({
    success: true,
    data: { total, active, delivered, villagesReached: uniqueVillages.length },
  });
};

// Platform admin: list all pending donations
export const getAllDonations = async (_req: AuthRequest, res: Response) => {
  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: { donorProfile: { include: { user: { select: { name: true } } } } },
  });
  return res.json({ success: true, data: donations });
};

// Platform admin: manually match donation to a village request
export const matchDonation = async (req: AuthRequest, res: Response) => {
  const { donationId, villageRequestId } = req.body;

  const [donation, villageRequest] = await Promise.all([
    prisma.donation.findUnique({ where: { id: donationId } }),
    prisma.villageRequest.findUnique({ where: { id: villageRequestId } }),
  ]);

  if (!donation || !villageRequest) {
    return res.status(404).json({ success: false, error: "Donation or village request not found" });
  }

  const [updatedDonation, updatedRequest] = await prisma.$transaction([
    prisma.donation.update({
      where: { id: donationId },
      data: { status: "matched", matchedVillageId: villageRequestId },
    }),
    prisma.villageRequest.update({
      where: { id: villageRequestId },
      data: { status: "matched" },
    }),
  ]);

  return res.json({ success: true, data: { donation: updatedDonation, villageRequest: updatedRequest } });
};
