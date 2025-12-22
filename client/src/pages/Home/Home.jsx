import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Compass,
  Calendar,
  Sparkles,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  ArrowRight,
  Globe,
  Map,
  Navigation,
  Star,
  Zap,
  Shield,
  Award,
  Plane,
  Camera,
  Mountain,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import delhi from "../../assets/delhi.jpeg";
import mumbai from "../../assets/mumbai.jpg";
import kashmir from "../../assets/kashmir.jpeg";
import kashi from "../../assets/kashi.jpeg";
import kolkata from "../../assets/kolkatta.jpeg";
import punjab from "../../assets/punjab.jpeg";
import styles from "./Home.module.css";

const Home = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStartPlanning = () => {
    isAuthenticated ? navigate("/planner") : navigate("/login");
  };

  const handlePlanTrip = () => {
    isAuthenticated ? navigate("/planner") : navigate("/signup");
  };

  const features = [
    {
      icon: <Sparkles />,
      title: "AI-POWERED",
      subtitle: "PLANNING",
      stat: "30s",
      desc: "Instant itinerary generation",
    },
    {
      icon: <Clock />,
      title: "TIME",
      subtitle: "OPTIMIZATION",
      stat: "100%",
      desc: "Smart route planning",
    },
    {
      icon: <DollarSign />,
      title: "BUDGET",
      subtitle: "TRACKING",
      stat: "Real-time",
      desc: "Expense monitoring",
    },
    {
      icon: <Users />,
      title: "GROUP",
      subtitle: "COORDINATION",
      stat: "Unlimited",
      desc: "Collaborative features",
    },
  ];

  const destinations = [
    {
      name: "DELHI",
      country: "INDIA",
      image: delhi,
      rating: 4.7,
      trips: "18.2K",
      cat: "CULTURAL",
    },
    {
      name: "MUMBAI",
      country: "INDIA",
      image: mumbai,
      rating: 4.6,
      trips: "16.5K",
      cat: "METRO",
    },
    {
      name: "KASHMIR",
      country: "INDIA",
      image: kashmir,
      rating: 4.9,
      trips: "12.3K",
      cat: "MOUNTAIN",
    },
    {
      name: "KASHI",
      country: "INDIA",
      image: kashi,
      rating: 4.8,
      trips: "14.7K",
      cat: "SPIRITUAL",
    },
    {
      name: "KOLKATA",
      country: "INDIA",
      image: kolkata,
      rating: 4.7,
      trips: "11.9K",
      cat: "HERITAGE",
    },
    {
      name: "PUNJAB",
      country: "INDIA",
      image: punjab,
      rating: 4.8,
      trips: "10.4K",
      cat: "VIBRANT",
    },
  ];

  const stats = [
    { num: "5M+", label: "TRAVELERS" },
    { num: "500K+", label: "TRIPS PLANNED" },
    { num: "98%", label: "SATISFACTION" },
    { num: "200+", label: "COUNTRIES" },
  ];

  return (
    <>
      <Navbar />

      {/* Cursor Glow */}
      <div
        className={styles.cursorGlow}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      <div className={styles.brutalistContainer}>
        {/* HERO - SPLIT BRUTAL */}
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            {/* LEFT MASSIVE TEXT */}
            <div className={styles.heroLeft}>
              <div className={styles.topTag}>
                <div className={styles.tagLine}></div>
                <span>AI-POWERED TRIP PLANNING</span>
              </div>

              <h1 className={styles.brutalistTitle}>
                PLAN YOUR
                <br />
                <span className={styles.glowText}>PERFECT</span>
                <br />
                TRIP
              </h1>

              <div className={styles.heroSubgrid}>
                <div className={styles.statBox}>
                  <div className={styles.statNum}>5M+</div>
                  <div className={styles.statLabel}>USERS</div>
                </div>
                <div className={styles.heroDesc}>
                  TRANSFORM YOUR TRAVEL DREAMS INTO REALITY WITH INTELLIGENT
                  PLANNING
                </div>
              </div>

              <div className={styles.ctaGroup}>
                <button
                  className={styles.primaryCta}
                  onClick={handleStartPlanning}
                >
                  <span>START PLANNING</span>
                  <ArrowRight size={24} />
                </button>
                <button
                  className={styles.secondaryCta}
                  onClick={() =>
                    document
                      .getElementById("destinations")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span>EXPLORE</span>
                </button>
              </div>
            </div>

            {/* RIGHT CHAOTIC CARDS */}
            <div className={styles.heroRight}>
              <div className={`${styles.floatCard} ${styles.card1}`}>
                <Plane size={48} />
                <div className={styles.cardNum}>200+</div>
                <div className={styles.cardText}>COUNTRIES</div>
              </div>
              <div className={`${styles.floatCard} ${styles.card2}`}>
                <Camera size={48} />
                <div className={styles.cardNum}>1M+</div>
                <div className={styles.cardText}>EXPERIENCES</div>
              </div>
              <div className={`${styles.floatCard} ${styles.card3}`}>
                <Star size={48} />
                <div className={styles.cardNum}>4.9★</div>
                <div className={styles.cardText}>RATING</div>
              </div>
            </div>
          </div>

          {/* Floating Stats Bar */}
          <div className={styles.statsBar}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statsItem}>
                <div className={styles.statsNum}>{stat.num}</div>
                <div className={styles.statsLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES - BRUTAL GRID */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionTag}>
            <span>FEATURES</span>
            <div className={styles.tagGlow}></div>
          </div>

          <h2 className={styles.sectionTitle}>
            EVERYTHING
            <br />
            YOU NEED
          </h2>

          <div className={styles.brutalGrid}>
            {features.map((feat, i) => (
              <div
                key={i}
                className={`${styles.gridCard} ${styles[`grid${i + 1}`]}`}
              >
                <div className={styles.cardCorner}></div>
                <div className={styles.cardIcon}>{feat.icon}</div>
                <div className={styles.cardStat}>{feat.stat}</div>
                <h3 className={styles.cardTitle}>
                  {feat.title}
                  <br />
                  {feat.subtitle}
                </h3>
                <p className={styles.cardDesc}>{feat.desc}</p>
                <div className={styles.cardGlow}></div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE - OVERLAPPING SECTIONS */}
        <section className={styles.whySection}>
          <div className={styles.whyContainer}>
            <div className={styles.whyLeft}>
              <div className={styles.whyLabel}>WHY CHOOSE US</div>
              <h2 className={styles.whyTitle}>
                THE SMART
                <br />
                WAY TO
                <br />
                <span className={styles.glowText}>TRAVEL</span>
              </h2>
            </div>

            <div className={styles.whyRight}>
              <div className={styles.whyCard}>
                <Zap size={56} />
                <div className={styles.whyNum}>30s</div>
                <h3>LIGHTNING FAST</h3>
                <p>Complete trip plan in under 30 seconds</p>
              </div>
              <div className={styles.whyCard}>
                <Shield size={56} />
                <div className={styles.whyNum}>5M+</div>
                <h3>TRUSTED & SAFE</h3>
                <p>Verified recommendations from millions</p>
              </div>
              <div className={styles.whyCard}>
                <Award size={56} />
                <div className={styles.whyNum}>#1</div>
                <h3>AWARD WINNING</h3>
                <p>Best trip planning platform 2024</p>
              </div>
              <div className={styles.whyCard}>
                <TrendingUp size={56} />
                <div className={styles.whyNum}>24/7</div>
                <h3>SMART UPDATES</h3>
                <p>Real-time adjustments based on events</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - MINIMAL BRUTAL */}
        <section className={styles.howSection}>
          <div className={styles.howHeader}>
            <span className={styles.howLabel}>HOW IT WORKS</span>
            <h2 className={styles.howTitle}>FOUR SIMPLE STEPS</h2>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <Globe size={64} />
              <h3>ENTER DESTINATION</h3>
              <p>Tell us where you want to go</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <Compass size={64} />
              <h3>SET PREFERENCES</h3>
              <p>Choose interests and budget</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <Map size={64} />
              <h3>GET YOUR PLAN</h3>
              <p>Personalized itinerary instantly</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>04</div>
              <Navigation size={64} />
              <h3>START EXPLORING</h3>
              <p>Follow plan and discover</p>
            </div>
          </div>
        </section>

        {/* DESTINATIONS - CHAOTIC MASONRY */}
        <section className={styles.destSection} id="destinations">
          <div className={styles.destHeader}>
            <span className={styles.destLabel}>DESTINATIONS</span>
            <h2 className={styles.destTitle}>
              EXPLORE
              <br />
              <span className={styles.glowText}>AMAZING</span>
              <br />
              PLACES
            </h2>
          </div>

          <div className={styles.chaoticGrid}>
            {destinations.map((dest, i) => (
              <div
                key={i}
                className={`${styles.destCard} ${styles[`dest${i + 1}`]}`}
                onClick={handlePlanTrip}
              >
                <div className={styles.destCorner}></div>
                <div className={styles.destImage}>
                  <img src={dest.image} alt={dest.name} />
                </div>
                <div className={styles.destInfo}>
                  <div className={styles.destCat}>{dest.cat}</div>
                  <h3 className={styles.destName}>{dest.name}</h3>
                  <div className={styles.destCountry}>{dest.country}</div>
                  <div className={styles.destMeta}>
                    <span>★ {dest.rating}</span>
                    <span>{dest.trips} TRIPS</span>
                  </div>
                </div>
                <div className={styles.destGlow}></div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA - FULL BRUTAL */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBg}></div>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              READY TO START
              <br />
              YOUR <span className={styles.glowText}>ADVENTURE</span>?
            </h2>
            <p className={styles.ctaText}>
              JOIN MILLIONS OF TRAVELERS AND PLAN YOUR PERFECT TRIP TODAY
            </p>
            <button className={styles.ctaButton} onClick={handleStartPlanning}>
              <span>START PLANNING NOW</span>
              <ArrowRight size={28} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
