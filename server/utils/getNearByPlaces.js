import axios from "axios";

export async function getNearbyHotels(lat, lon) {
  const query = `
    [out:json];
    (
      node["tourism"="hotel"](around:5000,${lat},${lon});
      node["tourism"="hostel"](around:5000,${lat},${lon});
      node["tourism"="guest_house"](around:5000,${lat},${lon});
    );
    out body 10;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  const res = await axios.post(url, query, {
    headers: { "Content-Type": "text/plain" },
  });

  return res.data.elements.map((p) => ({
    name: p.tags.name || "Unnamed stay",
    lat: p.lat,
    lng: p.lon,
    type: p.tags.tourism,
  }));
}
