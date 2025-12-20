import axios from "axios";

export async function geocodeCity(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    city
  )}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "smart-trip-planner",
    },
  });

  if (!res.data || res.data.length === 0) {
    throw new Error("City not found");
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
}
