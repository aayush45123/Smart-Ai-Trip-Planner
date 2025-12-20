import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MapView from "../../components/MapView/MapView";
import styles from "./TripResult.module.css";

export default function TripResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (!location.state || !location.state.trips) {
      navigate("/planner");
      return;
    }

    const incomingTrips = location.state.trips;

    setTrips(incomingTrips);
    setSelected(incomingTrips[0]);
    setSelectedRoute(incomingTrips[0].routes[0]);
  }, [location.state, navigate]);

  if (!selected) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>Loading trips…</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Trip Options</h2>
          <p className={styles.subtitle}>
            Choose the best route for your journey
          </p>
        </div>

        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>{trips.length} Option Available</h3>
            </div>

            <div className={styles.tripList}>
              {trips.map((trip, i) => (
                <div
                  key={i}
                  className={`${styles.tripCard} ${
                    selected.destination === trip.destination
                      ? styles.tripCardActive
                      : ""
                  }`}
                  onClick={() => {
                    setSelected(trip);
                    setSelectedRoute(trip.routes[0]);
                  }}
                >
                  <h4>{trip.destination}</h4>

                  {/* USE ROUTE DATA */}
                  <div className={styles.tripDetails}>
                    <div>📏 {trip.routes[0].distanceKm} km</div>
                    <div>⏱️ {trip.routes[0].durationHours} hrs</div>
                    <div>💰 ₹{trip.routes[0].totalCost}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main className={styles.mainContent}>
            {/* Route Selection */}
            <section className={styles.routeSelection}>
              <h3>Available Routes</h3>

              <div className={styles.routeList}>
                {selected.routes.map((route, idx) => (
                  <div
                    key={idx}
                    className={`${styles.routeCard} ${
                      selectedRoute === route ? styles.routeCardActive : ""
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <h4>{route.type}</h4>
                    <p>{route.distanceKm} km</p>
                    <p>{route.durationHours} hrs</p>
                    <p>₹{route.totalCost}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Map */}
            <section className={styles.mapSection}>
              <MapView
                startCity={selected.startCity}
                destination={selected.destination}
                selectedRoute={selectedRoute}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
