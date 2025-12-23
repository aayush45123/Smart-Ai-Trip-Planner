import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import styles from "./MapView.module.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({
  startCity,
  destination,
  selectedRoute,
  selectedPlace, // 👈 NEW
}) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!selectedRoute?.geometry) return;

    const formatted = selectedRoute.geometry.map(([lng, lat]) => [lat, lng]);
    setRouteCoords(formatted);
  }, [selectedRoute]);

  if (!routeCoords.length) return null;

  const startPos = routeCoords[0];
  const endPos = routeCoords[routeCoords.length - 1];

  return (
    <MapContainer
      center={endPos}
      zoom={7}
      style={{ height: "420px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <Marker position={startPos}>
        <Popup>Start: {startCity}</Popup>
      </Marker>

      <Marker position={endPos}>
        <Popup>Destination: {destination}</Popup>
      </Marker>

      <Polyline positions={routeCoords} color="#D4FF00" weight={4} />

      {/* ✅ SHOW ONLY WHEN CLICKED */}
      {selectedPlace && (
        <Marker position={[selectedPlace.lat, selectedPlace.lon]}>
          <Popup>{selectedPlace.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
