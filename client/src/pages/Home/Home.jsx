import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}></span>
          Smart Travel Planning Made Easy
        </div>

        <h1 className={styles.title}>
          Plan Your Perfect Trip with{" "}
          <span className={styles.titleAccent}>Smart Budget</span>
        </h1>

        <p className={styles.subtitle}>
          Create personalized travel itineraries, manage your budget
          effortlessly, and discover amazing destinations tailored to your
          preferences.
        </p>

        <div className={styles.ctaGroup}>
          <button
            className={styles.primaryButton}
            onClick={() => navigate("/planner")}
          >
            Start Planning
          </button>

          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>Budget Tracking</h3>
            <p className={styles.featureDescription}>
              Keep your expenses in check with real-time budget monitoring
            </p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🗺️</div>
            <h3 className={styles.featureTitle}>Smart Itineraries</h3>
            <p className={styles.featureDescription}>
              AI-powered suggestions for the best travel experiences
            </p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Quick & Easy</h3>
            <p className={styles.featureDescription}>
              Plan your entire trip in minutes with our intuitive interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
