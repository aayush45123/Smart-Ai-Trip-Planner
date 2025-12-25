import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import MapView from "../../components/MapView/MapView";
import { getDistanceKm } from "../../utils/distance";
import styles from "./TripResult.module.css";

export default function TripResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [aiTips, setAiTips] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.trips) {
      navigate("/planner");
      return;
    }

    const trip = location.state.trips[0];
    setSelectedTrip(trip);
    setSelectedRoute(trip.routes[0]);
  }, [location.state, navigate]);

  useEffect(() => {
    if (!selectedTrip?.destination) return;

    async function fetchAiTips() {
      setAiLoading(true);
      try {
        const res = await api.post("/ai/destination-tips", {
          destinationCity: selectedTrip.destination,
        });
        setAiTips(res.data);
      } catch (err) {
        console.error("Failed to fetch AI recommendations:", err);
        // Set default tips if API fails
        setAiTips({
          mustVisit: ["Explore local attractions", "Visit historical sites"],
          localFood: ["Try local cuisine", "Visit popular restaurants"],
          bestAreasToStay: ["City center", "Tourist areas"],
          safetyTips: ["Stay aware of surroundings", "Keep valuables secure"],
          bestTimeToExplore: "Early morning or evening",
          extraTips: ["Book in advance", "Learn local customs"],
        });
      } finally {
        setAiLoading(false);
      }
    }
    fetchAiTips();
  }, [selectedTrip?.destination]);

  if (!selectedTrip) {
    return <div className={styles.loading}>Loading Trip...</div>;
  }

  // Destination center (approx station / city center)
  const destLat = selectedRoute.geometry[selectedRoute.geometry.length - 1][1];
  const destLon = selectedRoute.geometry[selectedRoute.geometry.length - 1][0];

  const renderPlaces = (title, places) => (
    <div className={styles.placeGroup}>
      <h4>{title}</h4>

      {places && places.length > 0 ? (
        places.map((p) => {
          const distance = getDistanceKm(destLat, destLon, p.lat, p.lon);

          return (
            <div key={p.id} className={styles.placeItem}>
              <span>{p.name}</span>

              <span className={styles.distance}>{distance.toFixed(1)} KM</span>

              <button
                className={styles.locateBtn}
                onClick={() => setSelectedPlace(p)}
                title="Show on map"
                aria-label={`Locate ${p.name} on map`}
              >
                📍
              </button>
            </div>
          );
        })
      ) : (
        <p className={styles.noPlaces}>No places found nearby</p>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* SIDEBAR - PLACES LIST */}
      <aside className={styles.sidebar}>
        <h3>Nearby Places</h3>

        {renderPlaces("🏨 Hotels", selectedTrip.nearby.hotels)}

        {renderPlaces("🍽 Restaurants", selectedTrip.nearby.restaurants)}

        {renderPlaces("📍 Attractions", selectedTrip.nearby.attractions)}
      </aside>

      {/* AI RECOMMENDATIONS SIDEBAR */}
      <aside className={styles.aiSidebar}>
        <h3>🤖 AI RECOMMENDATIONS</h3>

        {aiLoading ? (
          <div className={styles.aiLoading}>Loading recommendations...</div>
        ) : aiTips ? (
          <>
            <h4>Must Visit</h4>
            <ul>
              {aiTips.mustVisit?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>

            <h4>Local Food</h4>
            <ul>
              {aiTips.localFood?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <h4>Best Areas</h4>
            <ul>
              {aiTips.bestAreasToStay?.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h4>Best Time</h4>
            <p>{aiTips.bestTimeToExplore}</p>

            <h4>Safety Tips</h4>
            <ul>
              {aiTips.safetyTips?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            {aiTips.extraTips && aiTips.extraTips.length > 0 && (
              <>
                <h4>Extra Tips</h4>
                <ul>
                  {aiTips.extraTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <p>Unable to load AI recommendations</p>
        )}
      </aside>

      {/* MAIN MAP AREA */}
      <main className={styles.main}>
        <div className={styles.mapHeader}>
          <h2>
            {selectedTrip.startCity} → {selectedTrip.destination}
          </h2>
          <p>
            {selectedTrip.days} Days • {selectedTrip.nights} Nights • ₹
            {selectedTrip.budget.toLocaleString()}
          </p>
        </div>

        <div className={styles.mapWrapper}>
          <MapView
            startCity={selectedTrip.startCity}
            destination={selectedTrip.destination}
            selectedRoute={selectedRoute}
            selectedPlace={selectedPlace}
          />
        </div>
      </main>
    </div>
  );
}
