import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Planner.module.css";

export default function Planner() {
  const [startCity, setStartCity] = useState("Pune");
  const [budget, setBudget] = useState(5000);
  const [days, setDays] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function generateTrip() {
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/trips/generate", {
        startCity,
        budget,
        days,
      });

      localStorage.setItem("trips", JSON.stringify(res.data.trips));
      navigate("/result");
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
            Tell us your preferences and we'll create a customized itinerary
          </p>
        </div>

        <div className={styles.card}>
          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* Starting City Selection */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>📍</span>
                Starting City
              </label>
              <select
                className={styles.select}
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                disabled={loading}
              >
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nashik">Nashik</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Budget Slider */}
            <div className={styles.formGroup}>
              <div className={styles.rangeGroup}>
                <div className={styles.rangeHeader}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>💰</span>
                    Budget
                  </label>
                  <span className={styles.budgetValue}>
                    ₹{budget.toLocaleString()}
                  </span>
                </div>

                <div className={styles.rangeWrapper}>
                  <input
                    type="range"
                    className={styles.range}
                    min="2000"
                    max="50000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    disabled={loading}
                  />
                  <div className={styles.rangeLabels}>
                    <span>₹2,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Number of Days */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="days">
                <span className={styles.labelIcon}>📅</span>
                Number of Days
              </label>
              <input
                id="days"
                type="number"
                className={styles.input}
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={loading}
              />
            </div>

            {/* Trip Summary */}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Trip Summary</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>From</span>
                  <span className={styles.summaryValue}>{startCity}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Duration</span>
                  <span className={styles.summaryValue}>
                    {days} {days === 1 ? "Day" : "Days"}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Budget</span>
                  <span className={styles.summaryValue}>
                    ₹{budget.toLocaleString()}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Per Day</span>
                  <span className={styles.summaryValue}>
                    ₹{Math.round(budget / days).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.generateButton}
                onClick={generateTrip}
                disabled={loading || days < 1}
              >
                {loading ? (
                  <>
                    <span>⏳</span>
                    Generating Your Trip...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Generate Trip Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
