import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import styles from "./MapView.module.css";

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon for selected place
const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map centering when place is selected
function MapController({ selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lon], 14, {
        duration: 1.5,
      });
    }
  }, [selectedPlace, map]);

  return null;
}

export default function MapView({
  startCity,
  destination,
  selectedRoute,
  selectedPlace,
}) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!selectedRoute?.geometry) return;

    const formatted = selectedRoute.geometry.map(([lng, lat]) => [lat, lng]);
    setRouteCoords(formatted);
  }, [selectedRoute]);

  if (!routeCoords.length) {
    return <div className={styles.loading}>Loading Map...</div>;
  }

  const startPos = routeCoords[0];
  const endPos = routeCoords[routeCoords.length - 1];

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={endPos}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Start Marker */}
        <Marker position={startPos}>
          <Popup>
            <strong>START</strong>
            <br />
            {startCity}
          </Popup>
        </Marker>

        {/* End Marker */}
        <Marker position={endPos}>
          <Popup>
            <strong>DESTINATION</strong>
            <br />
            {destination}
          </Popup>
        </Marker>

        {/* Route Line */}
        <Polyline
          positions={routeCoords}
          color="#06b6d4"
          weight={4}
          opacity={0.8}
        />

        {/* Selected Place Marker */}
        {selectedPlace && (
          <Marker
            position={[selectedPlace.lat, selectedPlace.lon]}
            icon={selectedIcon}
          >
            <Popup>
              <strong>{selectedPlace.name}</strong>
            </Popup>
          </Marker>
        )}

        {/* Map Controller for auto-centering */}
        <MapController selectedPlace={selectedPlace} />
      </MapContainer>

      {/* Map Legend */}
      <div className={styles.mapLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendIcon} ${styles.start}`}></div>
          <span>Start</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendIcon} ${styles.end}`}></div>
          <span>End</span>
        </div>
        {selectedPlace && (
          <div className={styles.legendItem}>
            <div className={`${styles.legendIcon} ${styles.selected}`}></div>
            <span>Selected</span>
          </div>
        )}
        <div className={styles.legendItem}>
          <div className={styles.legendLine}></div>
          <span>Route</span>
        </div>
      </div>
    </div>
  );
}
