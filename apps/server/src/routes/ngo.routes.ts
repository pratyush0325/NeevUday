import { Router } from "express";
import {
  getNgoProfile,
  getNgoStats,
  createProject,
  updateProjectProgress,
  getAllNgos,
  updateVerification,
} from "../controllers/ngo.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// NGO self routes
router.get("/profile", authenticate, requireRole("ngo"), getNgoProfile);
router.get("/stats", authenticate, requireRole("ngo"), getNgoStats);
router.post("/projects", authenticate, requireRole("ngo"), createProject);
router.patch("/projects/:projectId/progress", authenticate, requireRole("ngo"), updateProjectProgress);

// Platform admin routes
router.get("/", authenticate, requireRole("platform"), getAllNgos);
router.patch("/:ngoId/verify", authenticate, requireRole("platform"), updateVerification);

export default router;
