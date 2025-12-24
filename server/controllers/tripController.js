import Trip from "../models/Trip.js";
import { geocodeCity } from "../utils/geoCode.js";
import { getRoutes } from "../utils/getRoutes.js";
import { classifyRoutes } from "../utils/routeLogic.js";
import { getNearbyPlaces } from "../utils/getNearByPlaces.js";

export const generateTrips = async (req, res) => {
  try {
    const {
      startCity,
      destinationCity,
      travelers,
      days,
      nights,
      budget,
      stayType,
      travelMode,
      pace,
    } = req.body;

    if (!startCity || !destinationCity) {
      return res.status(400).json({
        message: "Start and destination required",
      });
    }

    // ✅ HARD GUARD (NO CRASH EVER)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized. Please login again.",
      });
    }

    await Trip.create({
      userId: req.user._id,
      startCity,
      destinationCity,
      travelers,
      days,
      nights,
      budget,
      stayType,
      travelMode,
      pace,
    });

    let startCoords;
    let endCoords;

    try {
      startCoords = await geocodeCity(startCity);
      endCoords = await geocodeCity(destinationCity);
    } catch (geoErr) {
      console.error("Geocoding failed:", geoErr.message);
      return res.status(502).json({
        message:
          "Location lookup failed. Try different cities or retry shortly.",
        error: geoErr.message,
      });
    }

    let rawRoutes;

    try {
      rawRoutes = await getRoutes(startCoords, endCoords);
    } catch (routeErr) {
      console.error("Route service failed:", routeErr.message);
      return res.status(502).json({
        message: "Routing service unavailable. Please try again in a moment.",
        error: routeErr.message,
      });
    }

    const routes = classifyRoutes(rawRoutes, {
      days,
      nights,
      budget,
      travelers,
      stayType,
      pace,
    });

    if (!routes.length) {
      return res.status(400).json({
        message: "No routes found within budget",
      });
    }

    const lodgingType = stayType === "hostel" ? "hostel" : "hotel";

    const safeNearbyFetch = async (type) => {
      try {
        return await getNearbyPlaces(endCoords.lat, endCoords.lng, type);
      } catch (nearbyErr) {
        console.error(`Nearby lookup failed for ${type}:`, nearbyErr.message);
        return [];
      }
    };

    const [hotels, restaurants, attractions] = await Promise.all([
      safeNearbyFetch(lodgingType),
      safeNearbyFetch("restaurant"),
      safeNearbyFetch("attraction"),
    ]);

    return res.json({
      trips: [
        {
          startCity,
          destination: destinationCity,
          travelers,
          days,
          nights,
          budget,
          stayType,
          travelMode,
          pace,
          routes,
          nearby: {
            hotels,
            restaurants,
            attractions,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Trip generation error:", error);
    return res.status(500).json({
      message: "Error generating trips",
      error: error.message,
    });
  }
};
