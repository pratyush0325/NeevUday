import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { LoginRequest, UserRole } from "@setu/shared";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, location } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ success: false, error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role as UserRole,
      location,
      // Create the role-specific profile in the same transaction
      ...(role === "donor" && { donorProfile: { create: { orgName: req.body.orgName } } }),
      ...(role === "ngo" && {
        ngoProfile: {
          create: {
            orgName: req.body.orgName,
            state: req.body.state,
            focusAreas: req.body.focusAreas || [],
          },
        },
      }),
      ...(role === "worker" && {
        workerProfile: {
          create: {
            skills: req.body.skills || [],
            preferredWork: req.body.preferredWork || "general",
            availableFrom: new Date(),
          },
        },
      }),
      ...(role === "village" && {
        villageProfile: {
          create: {
            villageName: req.body.villageName,
            state: req.body.state,
            district: req.body.district,
          },
        },
      }),
    },
    select: { id: true, name: true, email: true, role: true, location: true, verified: true, createdAt: true },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    success: true,
    data: {
      user: { ...user, avatarInitials: name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(), createdAt: user.createdAt.toISOString() },
      token,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        verified: user.verified,
        avatarInitials: user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        createdAt: user.createdAt.toISOString(),
      },
      token,
    },
  });
};

export const me = async (req: Request & { user?: any }, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, location: true, verified: true, createdAt: true },
  });

  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  return res.json({
    success: true,
    data: {
      ...user,
      avatarInitials: user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      createdAt: user.createdAt.toISOString(),
    },
  });
};
