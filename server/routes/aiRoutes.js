import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  aiPrefillTrip,
  aiDestinationTips,
} from "../controllers/aiController.js";

const router = express.Router();

// Both routes require authentication
router.post("/prefill", auth, aiPrefillTrip);
router.post("/destination-tips", auth, aiDestinationTips);

export default router;
