import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

const cityCoords = {
  Pune: [18.5204, 73.8567],
  Mumbai: [19.076, 72.8777],
  Lonavala: [18.7557, 73.4091],
  Nashik: [20.0059, 73.7897],
};

export default function MapView({ startCity, destination }) {
  const start = cityCoords[startCity];
  const end = cityCoords[destination];

  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    async function fetchRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

        const res = await axios.get(url);

        const coords = res.data.routes[0].geometry.coordinates;

        // Convert [lng, lat] → [lat, lng]
        const formatted = coords.map(([lng, lat]) => [lat, lng]);

        setRouteCoords(formatted);
      } catch (err) {
        console.error("Route fetch error", err);
      }
    }

    fetchRoute();
  }, [startCity, destination]);

  return (
    <MapContainer center={start} zoom={7} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={start}>
        <Popup>{startCity}</Popup>
      </Marker>

      <Marker position={end}>
        <Popup>{destination}</Popup>
      </Marker>

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
}
