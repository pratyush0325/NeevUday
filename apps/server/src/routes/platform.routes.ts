import { Router } from "express";
import { getPlatformStats, getMatchSuggestions } from "../controllers/platform.controller";
import { authenticate, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", authenticate, requireRole("platform"), getPlatformStats);
router.get("/match-suggestions", authenticate, requireRole("platform"), getMatchSuggestions);

export default router;
