import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Trip from "../models/Trip.js";

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON data
const routes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/routes.json"), "utf-8")
);

const stays = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/stays.json"), "utf-8")
);

export const generateTrips = async (req, res) => {
  try {
    const { startCity, budget, days } = req.body;
    const userId = req.user._id;

    const possibleTrips = routes
      .filter((r) => r.from === startCity)
      .map((r) => {
        const stay = stays.find((s) => s.city === r.to);

        const totalCost = r.cost + (stay?.cost || 0) * days + days * 300;

        return {
          destination: r.to,
          transport: r.type,
          travelCost: r.cost,
          stayCost: stay?.cost || 0,
          totalCost,
        };
      })
      .filter((t) => t.totalCost <= budget);

    await Trip.create({
      userId,
      startCity,
      days,
      budget,
    });

    res.json({ trips: possibleTrips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
