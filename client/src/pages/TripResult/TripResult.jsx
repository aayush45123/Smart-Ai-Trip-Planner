import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView/MapView";
import styles from "./TripResult.module.css";

export default function TripResult() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const storedTrips = localStorage.getItem("trips");

    if (!storedTrips) {
      navigate("/planner");
      return;
    }

    try {
      const parsedTrips = JSON.parse(storedTrips);
      if (parsedTrips && parsedTrips.length > 0) {
        setTrips(parsedTrips);
        setSelected(parsedTrips[0]);
      } else {
        navigate("/planner");
      }
    } catch (error) {
      console.error("Error parsing trips:", error);
      navigate("/planner");
    }
  }, [navigate]);

  if (!selected) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🗺️</div>
          <div className={styles.emptyText}>Loading your trips...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Trip Options</h2>
          <p className={styles.subtitle}>
            Choose your perfect destination from our curated recommendations
          </p>
        </div>

        <div className={styles.content}>
          {/* Sidebar with Trip Cards */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>
                {trips.length} {trips.length === 1 ? "Option" : "Options"}{" "}
                Available
              </h3>
              <p className={styles.sidebarSubtitle}>
                Select a destination to view details
              </p>
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
                  onClick={() => setSelected(trip)}
                >
                  <div className={styles.tripCardHeader}>
                    <div className={styles.tripDestination}>
                      <span className={styles.tripIcon}>🏖️</span>
                      <h4 className={styles.tripName}>{trip.destination}</h4>
                    </div>
                    {selected.destination === trip.destination && (
                      <span
                        className={`${styles.tripBadge} ${styles.tripBadgeActive}`}
                      >
                        Selected
                      </span>
                    )}
                  </div>

                  <div className={styles.tripCost}>
                    ₹{trip.totalCost?.toLocaleString()}
                  </div>

                  <div className={styles.tripDetails}>
                    {trip.duration && (
                      <div className={styles.tripDetail}>
                        <span className={styles.tripDetailIcon}>📅</span>
                        <span className={styles.tripDetailLabel}>Duration</span>
                        <span className={styles.tripDetailValue}>
                          {trip.duration}
                        </span>
                      </div>
                    )}
                    {trip.category && (
                      <div className={styles.tripDetail}>
                        <span className={styles.tripDetailIcon}>🏷️</span>
                        <span className={styles.tripDetailLabel}>Category</span>
                        <span className={styles.tripDetailValue}>
                          {trip.category}
                        </span>
                      </div>
                    )}
                    {trip.rating && (
                      <div className={styles.tripDetail}>
                        <span className={styles.tripDetailIcon}>⭐</span>
                        <span className={styles.tripDetailLabel}>Rating</span>
                        <span className={styles.tripDetailValue}>
                          {trip.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {/* Map Section */}
            <section className={styles.mapSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🗺️</span>
                <h3 className={styles.sectionTitle}>Route Overview</h3>
              </div>
              <MapView
                startCity={selected.startCity || "Pune"}
                destination={selected.destination}
              />
            </section>

            {/* Itinerary Section */}
            {selected.itinerary && selected.itinerary.length > 0 && (
              <section className={styles.itinerarySection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>📋</span>
                  <h3 className={styles.sectionTitle}>Day-by-Day Itinerary</h3>
                </div>

                <div className={styles.itineraryGrid}>
                  {selected.itinerary.map((day, index) => (
                    <div key={index} className={styles.dayCard}>
                      <div className={styles.dayHeader}>
                        <div className={styles.dayNumber}>{index + 1}</div>
                        <h4 className={styles.dayTitle}>
                          {day.title || `Day ${index + 1}`}
                        </h4>
                      </div>
                      <div className={styles.activities}>
                        {day.activities ? (
                          Array.isArray(day.activities) ? (
                            day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className={styles.activity}>
                                • {activity}
                              </div>
                            ))
                          ) : (
                            <div className={styles.activity}>
                              • {day.activities}
                            </div>
                          )
                        ) : (
                          <div className={styles.activity}>
                            • Explore {selected.destination}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
