import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MapView from "../../components/MapView/MapView";
import styles from "./TripResult.module.css";

export default function TripResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (!location.state?.trips) {
      navigate("/planner");
      return;
    }

    const incomingTrips = location.state.trips;

    setTrips(incomingTrips);
    setSelectedTrip(incomingTrips[0]);
    setSelectedRoute(incomingTrips[0].routes[0]);
  }, [location.state, navigate]);

  if (!selectedTrip) {
    return <div className={styles.container}>Loading trips…</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2>Your Trip Options</h2>
          <p>
            {selectedTrip.startCity} → {selectedTrip.destination}
          </p>
        </header>

        <div className={styles.content}>
          {/* ROUTES SIDEBAR */}
          <aside className={styles.sidebar}>
            {selectedTrip.routes.map((route, i) => (
              <div
                key={i}
                className={`${styles.routeCard} ${
                  selectedRoute === route ? styles.active : ""
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <h4>{route.type}</h4>
                <p>📏 {route.distanceKm} km</p>
                <p>⏱ {route.durationHours} hrs</p>
                <p>💰 ₹{route.totalCost}</p>
              </div>
            ))}
          </aside>

          {/* MAP */}
          <main className={styles.main}>
            <MapView
              startCity={selectedTrip.startCity}
              destination={selectedTrip.destination}
              selectedRoute={selectedRoute}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
