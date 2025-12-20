import { geocodeCity } from "../utils/geoCode.js";
import { getRoutes } from "../utils/getRoutes.js";
import { classifyRoutes } from "../utils/routeLogic.js";

export const generateTrips = async (req, res) => {
  try {
    const { startCity, destinationCity, days, budget } = req.body;

    if (!startCity || !destinationCity) {
      return res
        .status(400)
        .json({ message: "Start and destination required" });
    }

    const startCoords = await geocodeCity(startCity);
    const endCoords = await geocodeCity(destinationCity);

    const rawRoutes = await getRoutes(startCoords, endCoords);
    const routes = classifyRoutes(rawRoutes, days, budget);

    if (routes.length === 0) {
      return res.status(400).json({ message: "No routes found within budget" });
    }

    res.json({
      trips: [
        {
          startCity,
          destination: destinationCity,
          routes,
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
