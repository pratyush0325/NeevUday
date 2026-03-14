import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getWorkerProfile = async (req: AuthRequest, res: Response) => {
  const worker = await prisma.workerProfile.findUnique({
    where: { userId: req.user!.id },
    include: { assignments: { include: { ngoProfile: true, project: true } } },
  });
  if (!worker) return res.status(404).json({ success: false, error: "Worker profile not found" });
  return res.json({ success: true, data: worker });
};

export const updateWorkerProfile = async (req: AuthRequest, res: Response) => {
  const worker = await prisma.workerProfile.update({
    where: { userId: req.user!.id },
    data: req.body,
  });
  return res.json({ success: true, data: worker });
};

export const getActiveAssignment = async (req: AuthRequest, res: Response) => {
  const profile = await prisma.workerProfile.findUnique({ where: { userId: req.user!.id } });
  if (!profile) return res.status(404).json({ success: false, error: "Worker profile not found" });

  const assignment = await prisma.workerAssignment.findFirst({
    where: { workerProfileId: profile.id, status: "active" },
    include: { ngoProfile: { include: { user: true } }, project: true },
  });

  return res.json({ success: true, data: assignment });
};

export const updateAssignmentProgress = async (req: AuthRequest, res: Response) => {
  const { assignmentId } = req.params;
  const { progressPercent } = req.body;

  const assignment = await prisma.workerAssignment.update({
    where: { id: assignmentId },
    data: { progressPercent, ...(progressPercent === 100 && { status: "completed", endDate: new Date() }) },
  });

  return res.json({ success: true, data: assignment });
};

export const assignWorkerToNgo = async (req: AuthRequest, res: Response) => {
  const { workerProfileId, ngoProfileId, projectId, taskDescription } = req.body;

  const assignment = await prisma.workerAssignment.create({
    data: {
      workerProfileId,
      ngoProfileId,
      projectId,
      taskDescription,
      startDate: new Date(),
    },
  });

  await prisma.workerProfile.update({
    where: { id: workerProfileId },
    data: { status: "assigned" },
  });

  return res.status(201).json({ success: true, data: assignment });
};

export const getAvailableWorkers = async (_req: AuthRequest, res: Response) => {
  const workers = await prisma.workerProfile.findMany({
    where: { status: "available" },
    include: { user: { select: { name: true, location: true } } },
  });
  return res.json({ success: true, data: workers });
};
