import express from "express";
import { generateItinerary } from "../controllers/aiController.js";

const router = express.Router();

router.post("/itinerary", generateItinerary);

export default router;
