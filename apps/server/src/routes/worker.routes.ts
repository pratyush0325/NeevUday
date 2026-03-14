import { Router } from "express";
import {
  getWorkerProfile,
  updateWorkerProfile,
  getActiveAssignment,
  updateAssignmentProgress,
  assignWorkerToNgo,
  getAvailableWorkers,
} from "../controllers/worker.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// Worker self routes
router.get("/profile", authenticate, requireRole("worker"), getWorkerProfile);
router.patch("/profile", authenticate, requireRole("worker"), updateWorkerProfile);
router.get("/assignment/active", authenticate, requireRole("worker"), getActiveAssignment);
router.patch("/assignment/:assignmentId/progress", authenticate, requireRole("worker"), updateAssignmentProgress);

// Platform admin routes
router.get("/available", authenticate, requireRole("platform"), getAvailableWorkers);
router.post("/assign", authenticate, requireRole("platform"), assignWorkerToNgo);

export default router;
