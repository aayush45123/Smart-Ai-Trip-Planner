import axios from "axios";

export async function getNearbyPlaces(lat, lon, type = "hotel") {
  const radius = 15000; // 🔥 15 km (IMPORTANT)

  let tagQuery = "";

  if (type === "hotel") tagQuery = '["tourism"~"hotel|guest_house"]';
  if (type === "hostel") tagQuery = '["tourism"~"hostel|guest_house"]';
  if (type === "restaurant") tagQuery = '["amenity"="restaurant"]';
  if (type === "attraction") tagQuery = '["tourism"="attraction"]';

  const query = `
    [out:json][timeout:25];
    (
      node${tagQuery}(around:${radius},${lat},${lon});
    );
    out body;
  `;

  const res = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query,
    { headers: { "Content-Type": "text/plain" } }
  );

  return res.data.elements.map((place) => ({
    id: place.id,
    name: place.tags?.name || "Unnamed Place",
    lat: place.lat,
    lon: place.lon,
    type,
  }));
}
