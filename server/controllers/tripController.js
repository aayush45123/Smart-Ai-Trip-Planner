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
      // ✅ Calculate minimum required budget with detailed breakdown
      const stayCostPerNight =
        stayType === "hotel" ? 2000 : stayType === "homestay" ? 1200 : 800;

      let travelCostPerKm;
      if (actualDistance < 200) {
        travelCostPerKm = 10;
      } else if (actualDistance < 500) {
        travelCostPerKm = 7;
      } else if (actualDistance < 1000) {
        travelCostPerKm = 5;
      } else if (actualDistance < 1500) {
        travelCostPerKm = 4.5;
      } else {
        travelCostPerKm = 4;
      }

      const minTravelCost = Math.round(
        actualDistance * travelCostPerKm * travelers
      );
      const minStayCost = nights * stayCostPerNight * travelers;
      const minFoodCost = days * 500 * travelers; // ₹500/day/person
      const minActivityCost = days * 400 * travelers; // ₹400/day/person
      const minMiscCost = Math.round(
        (minTravelCost + minStayCost + minFoodCost + minActivityCost) * 0.15
      );

      const minBudget =
        minTravelCost +
        minStayCost +
        minFoodCost +
        minActivityCost +
        minMiscCost;

      return res.status(400).json({
        message: "No routes found within your budget",
        suggestion: `Try increasing your budget to at least ₹${minBudget.toLocaleString()} for this trip.`,
        details: {
          distance: `${actualDistance.toFixed(0)} km`,
          minimumBudget: minBudget,
          currentBudget: budget,
          breakdown: {
            travel: `₹${minTravelCost.toLocaleString()} (${actualDistance.toFixed(
              0
            )} km × ₹${travelCostPerKm} × ${travelers} travelers)`,
            accommodation: `₹${minStayCost.toLocaleString()} (${nights} nights × ₹${stayCostPerNight} × ${travelers} travelers)`,
            food: `₹${minFoodCost.toLocaleString()} (${days} days × ₹500 × ${travelers} travelers)`,
            activities: `₹${minActivityCost.toLocaleString()} (${days} days × ₹400 × ${travelers} travelers)`,
            miscellaneous: `₹${minMiscCost.toLocaleString()} (15% buffer)`,
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
