import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { CreateVillageRequestRequest } from "./shared.types";

export const createRequest = async (req: AuthRequest, res: Response) => {
  const body: CreateVillageRequestRequest = req.body;

  const village = await prisma.villageProfile.findUnique({ where: { userId: req.user!.id } });
  if (!village) return res.status(404).json({ success: false, error: "Village profile not found" });

  const request = await prisma.villageRequest.create({
    data: {
      villageProfileId: village.id,
      requestType: body.requestType,
      urgency: body.urgency,
      quantity: body.quantity,
      familiesAffected: body.familiesAffected,
      requiredBy: new Date(body.requiredBy),
      details: body.details,
    },
  });

  return res.status(201).json({ success: true, data: request });
};

export const getMyRequests = async (req: AuthRequest, res: Response) => {
  const village = await prisma.villageProfile.findUnique({ where: { userId: req.user!.id } });
  if (!village) return res.status(404).json({ success: false, error: "Village profile not found" });

  const requests = await prisma.villageRequest.findMany({
    where: { villageProfileId: village.id },
    orderBy: [{ urgency: "asc" }, { createdAt: "desc" }],
  });

  return res.json({ success: true, data: requests });
};

export const getVillageStats = async (req: AuthRequest, res: Response) => {
  const village = await prisma.villageProfile.findUnique({ where: { userId: req.user!.id } });
  if (!village) return res.status(404).json({ success: false, error: "Village profile not found" });

  const [total, fulfilled, pending] = await Promise.all([
    prisma.villageRequest.count({ where: { villageProfileId: village.id } }),
    prisma.villageRequest.count({ where: { villageProfileId: village.id, status: "fulfilled" } }),
    prisma.villageRequest.count({ where: { villageProfileId: village.id, status: "pending" } }),
  ]);

  return res.json({ success: true, data: { total, fulfilled, pending } });
};

export const getAllRequests = async (_req: AuthRequest, res: Response) => {
  const requests = await prisma.villageRequest.findMany({
    orderBy: [{ urgency: "asc" }, { createdAt: "desc" }],
    include: { villageProfile: { include: { user: { select: { name: true } } } } },
  });
  return res.json({ success: true, data: requests });
};
