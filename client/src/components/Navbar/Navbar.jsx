import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Menu, X, LogOut, User } from "lucide-react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    if (!isAuthenticated && path !== "/") {
      // If user is not authenticated and trying to access protected routes
      navigate("/login");
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <MapPin size={28} />
          <span className={styles.logoText}>
            Smart<span className={styles.logoAccent}>Trip</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <button
            onClick={() => handleNavClick("/planner")}
            className={styles.navLink}
          >
            Plan Trip
          </button>
          <Link to="/#destinations" className={styles.navLink}>
            Destinations
          </Link>
          <Link to="/#how-it-works" className={styles.navLink}>
            How It Works
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          {isAuthenticated ? (
            <>
              <button className={styles.profileBtn}>
                <User size={20} />
                <span>Profile</span>
              </button>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>
                Login
              </Link>
              <Link to="/signup" className={styles.signupBtn}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <Link
              to="/"
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <button
              onClick={() => handleNavClick("/planner")}
              className={styles.mobileNavLink}
            >
              Plan Trip
            </button>
            <Link
              to="/#destinations"
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link
              to="/#how-it-works"
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>

            <div className={styles.mobileDivider}></div>

            {isAuthenticated ? (
              <>
                <button
                  className={styles.mobileNavLink}
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User size={20} />
                  Profile
                </button>
                <button className={styles.mobileNavLink} onClick={handleLogout}>
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={styles.mobileLoginBtn}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={styles.mobileSignupBtn}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
