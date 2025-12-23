import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MapView from "../../components/MapView/MapView";
import { getDistanceKm } from "../../utils/distance";
import styles from "./TripResult.module.css";

export default function TripResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (!location.state?.trips) {
      navigate("/planner");
      return;
    }

    const trip = location.state.trips[0];
    setSelectedTrip(trip);
    setSelectedRoute(trip.routes[0]);
  }, [location.state, navigate]);

  if (!selectedTrip) return <div>Loading…</div>;

  // Destination center (approx station / city center)
  const destLat = selectedRoute.geometry[selectedRoute.geometry.length - 1][1];
  const destLon = selectedRoute.geometry[selectedRoute.geometry.length - 1][0];

  const renderPlaces = (title, places) => (
    <div className={styles.placeGroup}>
      <h4>{title}</h4>

      {places.map((p) => {
        const distance = getDistanceKm(destLat, destLon, p.lat, p.lon);

        return (
          <div key={p.id} className={styles.placeItem}>
            <span>{p.name}</span>

            <span className={styles.distance}>{distance} km</span>

            <button
              className={styles.locateBtn}
              onClick={() => setSelectedPlace(p)}
              title="Show on map"
            >
              📍
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3>Nearby Places</h3>

        {renderPlaces("🏨 Hotels", selectedTrip.nearby.hotels)}

        {renderPlaces("🍽 Restaurants", selectedTrip.nearby.restaurants)}

        {renderPlaces("📍 Attractions", selectedTrip.nearby.attractions)}
      </aside>

      <main className={styles.main}>
        <MapView
          startCity={selectedTrip.startCity}
          destination={selectedTrip.destination}
          selectedRoute={selectedRoute}
          selectedPlace={selectedPlace} // 👈 CONTROLLED
        />
      </main>
    </div>
  );
}
