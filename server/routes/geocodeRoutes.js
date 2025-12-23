import express from "express";
import axios from "axios";

const router = express.Router();

// Configuration for Nominatim
const NOMINATIM_CONFIG = {
  headers: {
    "User-Agent": "SmartTripPlanner/1.0 (contact@smarttrip.com)",
    "Accept-Language": "en-US,en;q=0.9",
  },
  timeout: 5000,
};

// ✅ Reverse geocode endpoint (coordinates to city name)
router.get("/reverse", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    const response = await axios.get(url, NOMINATIM_CONFIG);

    res.json(response.data);
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    res.status(500).json({
      message: "Failed to fetch location data",
      error: error.message,
    });
  }
});

// ✅ Forward geocode endpoint (city name to coordinates)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}&addressdetails=1&limit=5`;

    const response = await axios.get(url, NOMINATIM_CONFIG);

    res.json(response.data);
  } catch (error) {
    console.error("Forward geocoding error:", error.message);
    res.status(500).json({
      message: "Failed to search location",
      error: error.message,
    });
  }
});

export default router;
