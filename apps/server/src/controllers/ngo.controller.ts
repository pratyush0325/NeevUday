import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getNgoProfile = async (req: AuthRequest, res: Response) => {
  const ngo = await prisma.ngoProfile.findUnique({
    where: { userId: req.user!.id },
    include: { projects: true },
  });
  if (!ngo) return res.status(404).json({ success: false, error: "NGO profile not found" });
  return res.json({ success: true, data: ngo });
};

export const getNgoStats = async (req: AuthRequest, res: Response) => {
  const ngo = await prisma.ngoProfile.findUnique({ where: { userId: req.user!.id } });
  if (!ngo) return res.status(404).json({ success: false, error: "NGO profile not found" });

  const [workersAssigned, activeProjects] = await Promise.all([
    prisma.workerAssignment.count({ where: { ngoProfileId: ngo.id, status: "active" } }),
    prisma.ngoProject.count({ where: { ngoProfileId: ngo.id, status: "active" } }),
  ]);

  return res.json({ success: true, data: { workersAssigned, activeProjects } });
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const ngo = await prisma.ngoProfile.findUnique({ where: { userId: req.user!.id } });
  if (!ngo) return res.status(404).json({ success: false, error: "NGO profile not found" });

  const project = await prisma.ngoProject.create({
    data: { ...req.body, ngoProfileId: ngo.id },
  });

  return res.status(201).json({ success: true, data: project });
};

export const updateProjectProgress = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { progressPercent } = req.body;

  const project = await prisma.ngoProject.update({
    where: { id: projectId },
    data: { progressPercent, ...(progressPercent === 100 && { status: "completed" }) },
  });

  return res.json({ success: true, data: project });
};

// Platform admin
export const getAllNgos = async (_req: AuthRequest, res: Response) => {
  const ngos = await prisma.ngoProfile.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { verificationStatus: "asc" },
  });
  return res.json({ success: true, data: ngos });
};

export const updateVerification = async (req: AuthRequest, res: Response) => {
  const { ngoId } = req.params;
  const { status } = req.body;

  const ngo = await prisma.ngoProfile.update({
    where: { id: ngoId },
    data: {
      verificationStatus: status,
      ...(status === "approved" && { user: { update: { verified: true } } }),
    },
  });

  return res.json({ success: true, data: ngo });
};
