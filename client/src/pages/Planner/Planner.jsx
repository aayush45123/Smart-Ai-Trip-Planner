import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Planner.module.css";

export default function Planner() {
  const [startCity, setStartCity] = useState("Pune");
  const [destinationCity, setDestinationCity] = useState("");
  const [budget, setBudget] = useState(5000);
  const [days, setDays] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function generateTrip() {
    if (!destinationCity.trim()) {
      setError("Please enter a destination city");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/trips/generate", {
        startCity,
        destinationCity,
        budget,
        days,
      });

      navigate("/result", {
        state: {
          trips: res.data.trips,
        },
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Plan Your Perfect Trip</h2>
          <p className={styles.subtitle}>
            Choose start & destination cities to generate real routes
          </p>
        </div>

        <div className={styles.card}>
          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* START CITY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>📍 Starting City</label>
              <select
                className={styles.select}
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                disabled={loading}
              >
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* DESTINATION CITY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>🏁 Destination City</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter destination city"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* BUDGET */}
            <div className={styles.formGroup}>
              <label className={styles.label}>💰 Budget</label>
              <input
                type="range"
                min="2000"
                max="50000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                disabled={loading}
              />
              <div>₹{budget.toLocaleString()}</div>
            </div>

            {/* DAYS */}
            <div className={styles.formGroup}>
              <label className={styles.label}>📅 Number of Days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={loading}
              />
            </div>

            {/* SUMMARY */}
            <div className={styles.summary}>
              <p>
                <strong>From:</strong> {startCity}
              </p>
              <p>
                <strong>To:</strong> {destinationCity || "—"}
              </p>
              <p>
                <strong>Days:</strong> {days}
              </p>
              <p>
                <strong>Budget:</strong> ₹{budget.toLocaleString()}
              </p>
            </div>

            {/* BUTTON */}
            <button
              className={styles.generateButton}
              onClick={generateTrip}
              disabled={loading}
            >
              {loading ? "⏳ Generating..." : "✨ Generate Trip"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
