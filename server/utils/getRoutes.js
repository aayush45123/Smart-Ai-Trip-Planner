import axios from "axios";

export async function getRoutes(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true&overview=full&geometries=geojson`;

  const res = await axios.get(url);

  return res.data.routes;
}
