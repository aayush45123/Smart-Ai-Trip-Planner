import express from "express";
import auth from "../middleware/authMiddleware.js";
import { generateTrips } from "../controllers/tripController.js";

const router = express.Router();

router.post("/generate", auth, generateTrips);

export default router;
