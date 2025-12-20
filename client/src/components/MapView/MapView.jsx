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

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ startCity, destination, selectedRoute }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!selectedRoute || !selectedRoute.geometry) return;

    // Convert OSRM geometry → Leaflet format
    const formatted = selectedRoute.geometry.map(([lng, lat]) => [lat, lng]);

    setRouteCoords(formatted);
  }, [selectedRoute]);

  if (!routeCoords.length) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.loading}>Loading map…</div>
      </div>
    );
  }

  const startPos = routeCoords[0];
  const endPos = routeCoords[routeCoords.length - 1];

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapWrapper}>
        {/* Header */}
        <div className={styles.mapHeader}>
          <div className={styles.mapBadge}>
            📍 {startCity} → {destination}
          </div>
          <div className={`${styles.mapBadge} ${styles.routeBadge}`}>
            🚗 {selectedRoute.distanceKm} km • {selectedRoute.durationHours} hrs
          </div>
        </div>

        <MapContainer
          center={startPos}
          zoom={6}
          style={{ height: "420px", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* Start Marker */}
          <Marker position={startPos}>
            <Popup>Start: {startCity}</Popup>
          </Marker>

          {/* End Marker */}
          <Marker position={endPos}>
            <Popup>Destination: {destination}</Popup>
          </Marker>

          {/* Route */}
          <Polyline
            positions={routeCoords}
            color="#D4FF00"
            weight={4}
            opacity={0.9}
          />
        </MapContainer>
      </div>
    </div>
  );
}
