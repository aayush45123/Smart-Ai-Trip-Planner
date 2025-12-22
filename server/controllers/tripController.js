import Trip from "../models/Trip.js";
import { geocodeCity } from "../utils/geoCode.js";
import { getRoutes } from "../utils/getRoutes.js";
import { classifyRoutes } from "../utils/routeLogic.js";

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

    // Save preferences
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

    const startCoords = await geocodeCity(startCity);
    const endCoords = await geocodeCity(destinationCity);

    const rawRoutes = await getRoutes(startCoords, endCoords);

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

    // Practical warning
    if (routes[0].distanceKm > 3000) {
      return res.json({
        warning: "Road travel for this destination may not be practical.",
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
          },
        ],
      });
    }

    // ✅ ALWAYS THIS STRUCTURE
    res.json({
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
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating trips",
      error: error.message,
    });
  }
};
