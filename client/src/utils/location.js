import axios from "axios";

export async function getCityFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "smart-trip-planner",
    },
  });

  const address = res.data.address;

  return address.city || address.town || address.village || address.state || "";
}
