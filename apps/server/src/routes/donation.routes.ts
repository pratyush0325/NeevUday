import { Router } from "express";
import {
  createDonation,
  getMyDonations,
  getDonorStats,
  getAllDonations,
  matchDonation,
} from "../controllers/donation.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

// Donor routes
router.post("/", authenticate, requireRole("donor"), createDonation);
router.get("/mine", authenticate, requireRole("donor"), getMyDonations);
router.get("/stats", authenticate, requireRole("donor"), getDonorStats);

// Platform admin routes
router.get("/", authenticate, requireRole("platform"), getAllDonations);
router.post("/match", authenticate, requireRole("platform"), matchDonation);

export default router;
