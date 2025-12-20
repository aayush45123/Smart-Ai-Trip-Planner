import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MapView.module.css";

const cityCoords = {
  Pune: [18.5204, 73.8567],
  Mumbai: [19.076, 72.8777],
  Lonavala: [18.7557, 73.4091],
  Nashik: [20.0059, 73.7897],
  Delhi: [28.6139, 77.209],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
};

export default function MapView({ startCity, destination }) {
  const start = cityCoords[startCity] || cityCoords.Pune;
  const end = cityCoords[destination] || cityCoords.Mumbai;

  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    async function fetchRoute() {
      setLoading(true);
      setError("");

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

        const res = await axios.get(url);

        if (res.data.routes && res.data.routes.length > 0) {
          const route = res.data.routes[0];
          const coords = route.geometry.coordinates;

          // Convert [lng, lat] → [lat, lng]
          const formatted = coords.map(([lng, lat]) => [lat, lng]);

          setRouteCoords(formatted);

          // Set route information
          setRouteInfo({
            distance: (route.distance / 1000).toFixed(1), // Convert to km
            duration: Math.round(route.duration / 60), // Convert to minutes
          });
        }
      } catch (err) {
        console.error("Route fetch error", err);
        setError("Failed to load route. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (start && end) {
      fetchRoute();
    }
  }, [startCity, destination]);

  if (error) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>🗺️</div>
          <div className={styles.errorText}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapWrapper}>
        {/* Map Header with Badges */}
        <div className={styles.mapHeader}>
          <div className={styles.mapBadge}>
            <span className={styles.mapBadgeIcon}>📍</span>
            {startCity} → {destination}
          </div>
          {routeInfo && (
            <div className={`${styles.mapBadge} ${styles.routeBadge}`}>
              <span className={styles.mapBadgeIcon}>🚗</span>
              {routeInfo.distance} km • {Math.round(routeInfo.duration / 60)}h{" "}
              {routeInfo.duration % 60}m
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <span className={styles.loadingText}>Loading route...</span>
          </div>
        )}

        {/* Map */}
        <MapContainer
          center={start}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Start Marker */}
          <Marker position={start}>
            <Popup>
              <strong>🏁 Starting Point</strong>
              <br />
              {startCity}
            </Popup>
          </Marker>

          {/* End Marker */}
          <Marker position={end}>
            <Popup>
              <strong>🎯 Destination</strong>
              <br />
              {destination}
            </Popup>
          </Marker>

          {/* Route Line */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              color="#D4FF00"
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>

        {/* Route Information Footer */}
        {routeInfo && !loading && (
          <div className={styles.routeInfo}>
            <div className={styles.routeInfoItem}>
              <span className={styles.routeInfoLabel}>Distance</span>
              <span className={styles.routeInfoValue}>
                {routeInfo.distance} km
              </span>
            </div>
            <div className={styles.routeInfoItem}>
              <span className={styles.routeInfoLabel}>Duration</span>
              <span className={styles.routeInfoValue}>
                {Math.floor(routeInfo.duration / 60)}h {routeInfo.duration % 60}
                m
              </span>
            </div>
            <div className={styles.routeInfoItem}>
              <span className={styles.routeInfoLabel}>Avg Speed</span>
              <span className={styles.routeInfoValue}>
                {Math.round(routeInfo.distance / (routeInfo.duration / 60))}{" "}
                km/h
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
