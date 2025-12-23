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

    // 🔥 Fetch nearby places
    const hotels = await getNearbyPlaces(
      endCoords.lat,
      endCoords.lng,
      stayType
    );

    const restaurants = await getNearbyPlaces(
      endCoords.lat,
      endCoords.lng,
      "restaurant"
    );

    const attractions = await getNearbyPlaces(
      endCoords.lat,
      endCoords.lng,
      "attraction"
    );

    // 🔍 DEBUG LOGS (REMOVE LATER)
    console.log("Hotels:", hotels.length);
    console.log("Restaurants:", restaurants.length);
    console.log("Attractions:", attractions.length);

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
          nearby: {
            hotels,
            restaurants,
            attractions,
          },
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
