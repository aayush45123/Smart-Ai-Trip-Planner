import { useState, useEffect } from "react";
import api from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { getCityFromCoords } from "../../utils/location";
import styles from "./Planner.module.css";

export default function Planner() {
  const navigate = useNavigate();
  const location = useLocation();

  // BASIC
  const [startCity, setStartCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");

  // TRIP CONSTRAINTS
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [nights, setNights] = useState(2);
  const [budget, setBudget] = useState(8000);

  const [stayType, setStayType] = useState("hostel");
  const [travelMode, setTravelMode] = useState("road");
  const [pace, setPace] = useState("balanced");

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  // Prefill destination when coming from cards
  useEffect(() => {
    if (location.state?.destinationCity) {
      setDestinationCity(location.state.destinationCity);
    }
  }, [location.state]);

  // 📍 AUTO-DETECT USER CITY ON LOAD
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await getCityFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          if (city) {
            setStartCity(city);
          }
        } catch (err) {
          console.error("Error getting city:", err);
        }
      },
      (error) => {
        console.log("Geolocation permission denied or error:", error);
      }
    );
  }, []);

  async function generateTrip() {
    if (!startCity.trim() || !destinationCity.trim()) {
      setError("Please enter both starting and destination cities");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/trips/generate", {
        startCity,
        destinationCity,
        travelers,
        days,
        nights,
        budget,
        stayType,
        travelMode,
        pace,
      });

      navigate("/result", {
        state: { trips: res.data.trips },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function aiAutoFill() {
    if (!startCity.trim() || !destinationCity.trim()) {
      alert("Please enter both starting and destination cities first");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const res = await api.post("/ai/prefill", {
        startCity,
        destinationCity,
        travelers,
      });

      // Update all fields with AI suggestions
      if (res.data.days) setDays(res.data.days);
      if (res.data.nights) setNights(res.data.nights);
      if (res.data.budget) setBudget(res.data.budget);
      if (res.data.stayType) setStayType(res.data.stayType);
      if (res.data.travelMode) setTravelMode(res.data.travelMode);
      if (res.data.pace) setPace(res.data.pace);

      // Show success message
      alert("✅ AI has auto-filled the trip details!");
    } catch (err) {
      console.error("AI Auto-fill Error:", err);
      setError("AI auto-fill failed. You can still plan your trip manually.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <span className={styles.kicker}>AI-POWERED TRIP PLANNING</span>
          <h1 className={styles.title}>
            PLAN YOUR <span>PERFECT</span> TRIP
          </h1>
        </header>

        <div className={`${styles.card} glass-card`}>
          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* START CITY (AUTO-DETECTED + EDITABLE) */}
            <div className={styles.formGroup}>
              <label>Starting City</label>
              <input
                type="text"
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                placeholder="Detecting your city…"
              />
            </div>

            {/* DESTINATION CITY */}
            <div className={styles.formGroup}>
              <label>Destination City</label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
              />
            </div>

            {/* TRAVELERS */}
            <div className={styles.formGroup}>
              <label>Number of Travelers</label>
              <input
                type="number"
                min="1"
                max="10"
                value={travelers}
                onChange={(e) => setTravelers(+e.target.value)}
              />
            </div>

            {/* DAYS & NIGHTS */}
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Days</label>
                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(+e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nights</label>
                <input
                  type="number"
                  min="0"
                  value={nights}
                  onChange={(e) => setNights(+e.target.value)}
                />
              </div>
            </div>

            {/* BUDGET */}
            <div className={styles.formGroup}>
              <label>Budget (₹)</label>
              <input
                type="range"
                min="2000"
                max="500000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(+e.target.value)}
              />
              <span className={styles.value}>₹{budget.toLocaleString()}</span>
            </div>

            {/* STAY TYPE */}
            <div className={styles.formGroup}>
              <label>Stay Type</label>
              <select
                value={stayType}
                onChange={(e) => setStayType(e.target.value)}
              >
                <option value="hostel">Hostel (Budget)</option>
                <option value="homestay">Homestay</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>

            {/* TRAVEL MODE */}
            <div className={styles.formGroup}>
              <label>Travel Mode</label>
              <select
                value={travelMode}
                onChange={(e) => setTravelMode(e.target.value)}
              >
                <option value="road">Road</option>
                <option value="train">Train</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* PACE */}
            <div className={styles.formGroup}>
              <label>Travel Pace</label>
              <select value={pace} onChange={(e) => setPace(e.target.value)}>
                <option value="relaxed">Relaxed</option>
                <option value="balanced">Balanced</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <button
              className={styles.aiBtn}
              onClick={aiAutoFill}
              disabled={aiLoading || !startCity || !destinationCity}
            >
              {aiLoading ? "⏳ AI Working..." : "🤖 AI AUTO-FILL TRIP"}
            </button>

            <button
              className="btn-primary"
              disabled={loading}
              onClick={generateTrip}
            >
              {loading ? "⏳ Generating…" : "START PLANNING →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
