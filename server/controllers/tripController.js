import Trip from "../models/Trip.js";
import { geocodeCity } from "../utils/geoCode.js";
import { getRoutes } from "../utils/getRoutes.js";
import { classifyRoutes } from "../utils/routeLogic.js";
import { getNearbyPlaces } from "../utils/getNearByPlaces.js";
import { getDistance } from "../utils/distance.js";

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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized. Please login again.",
      });
    }

    // ✅ SAVE TRIP TO DATABASE
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

    // ✅ GET REAL COORDINATES
    let startCoords;
    let endCoords;

    try {
      console.log(`Geocoding: ${startCity} -> ${destinationCity}`);
      startCoords = await geocodeCity(startCity);
      endCoords = await geocodeCity(destinationCity);
      console.log("Coordinates found:", { startCoords, endCoords });
    } catch (geoErr) {
      console.error("Geocoding failed:", geoErr.message);
      return res.status(502).json({
        message:
          "Could not find these cities. Please check spelling and try again.",
        error: geoErr.message,
      });
    }

    // ✅ CALCULATE REAL DISTANCE
    const actualDistance = getDistance(
      startCoords.lat,
      startCoords.lng,
      endCoords.lat,
      endCoords.lng
    );
    console.log(`Actual distance: ${actualDistance.toFixed(2)} km`);

    // ✅ GET REAL ROUTES
    let rawRoutes;

    try {
      console.log("Fetching routes from OSRM...");
      rawRoutes = await getRoutes(startCoords, endCoords);
      console.log(`Found ${rawRoutes.length} routes`);
    } catch (routeErr) {
      console.error("Route service failed:", routeErr.message);
      return res.status(502).json({
        message: "Routing service unavailable. Please try again in a moment.",
        error: routeErr.message,
      });
    }

    // ✅ CLASSIFY ROUTES WITH REAL DATA
    const routes = classifyRoutes(rawRoutes, {
      days,
      nights,
      budget,
      travelers,
      stayType,
      pace,
    });

    console.log(`Classified ${routes.length} routes within budget`);

    if (!routes.length) {
      // Calculate minimum required budget
      const minTravelCost = Math.round(actualDistance * 5 * travelers);
      const minStayCost = nights * 500 * travelers;
      const minFoodCost = days * 300 * travelers;
      const minBudget = minTravelCost + minStayCost + minFoodCost;

      return res.status(400).json({
        message: "No routes found within your budget",
        suggestion: `Try increasing your budget to at least ₹${minBudget.toLocaleString()} for this trip.`,
        details: {
          distance: `${actualDistance.toFixed(0)} km`,
          minimumBudget: minBudget,
          breakdown: {
            travel: minTravelCost,
            stay: minStayCost,
            food: minFoodCost,
          },
        },
      });
    }

    // ✅ GET REAL NEARBY PLACES
    const lodgingType = stayType === "hostel" ? "hostel" : "hotel";

    console.log("Fetching nearby places...");

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

    console.log(
      `Found: ${hotels.length} hotels, ${restaurants.length} restaurants, ${attractions.length} attractions`
    );

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
          actualDistance: Math.round(actualDistance),
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
