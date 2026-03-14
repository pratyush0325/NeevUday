import { Router } from "express";
import {
  createRequest,
  getMyRequests,
  getVillageStats,
  getAllRequests,
} from "../controllers/village.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/requests", authenticate, requireRole("village"), createRequest);
router.get("/requests/mine", authenticate, requireRole("village"), getMyRequests);
router.get("/stats", authenticate, requireRole("village"), getVillageStats);

// Platform admin
router.get("/requests", authenticate, requireRole("platform"), getAllRequests);

export default router;
