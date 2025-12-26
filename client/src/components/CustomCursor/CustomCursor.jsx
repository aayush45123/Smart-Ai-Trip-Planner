import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [trail, setTrail] = useState([]);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    let animationFrameId;

    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Add trail effect
      setTrail((prev) => [
        ...prev.slice(-6),
        { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() },
      ]);
    };

    const smoothRingFollow = () => {
      setRingPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(smoothRingFollow);
    };

    const updateCursorStyle = (e) => {
      const target = e.target;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.onclick !== null ||
        target.style.cursor === "pointer" ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsPointer(isClickable);
    };

    const handleClick = (e) => {
      // Create ripple effect on click
      setRipples((prev) => [
        ...prev,
        {
          x: e.clientX,
          y: e.clientY,
          id: Date.now() + Math.random(),
        },
      ]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 800);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseover", updateCursorStyle);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClick);

    animationFrameId = requestAnimationFrame(smoothRingFollow);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseover", updateCursorStyle);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position]);

  return (
    <>
      {/* Trail Effect */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className={styles.cursorTrail}
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
          }}
        />
      ))}

      {/* Click Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={styles.clickRipple}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
          }}
        />
      ))}

      {/* Main Cursor - Diamond Core */}
      <div
        className={`${styles.brutalistCursor} ${
          isPointer ? styles.pointer : ""
        } ${isHidden ? styles.hidden : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className={styles.cursorCore}>
          <div className={styles.coreGlow} />
        </div>
      </div>

      {/* Outer Square Ring - Brutalist Style */}
      <div
        className={`${styles.brutalistRing} ${
          isPointer ? styles.pointer : ""
        } ${isHidden ? styles.hidden : ""}`}
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
        }}
      >
        <div className={styles.ringCorner} style={{ top: 0, left: 0 }} />
        <div className={styles.ringCorner} style={{ top: 0, right: 0 }} />
        <div className={styles.ringCorner} style={{ bottom: 0, left: 0 }} />
        <div className={styles.ringCorner} style={{ bottom: 0, right: 0 }} />
      </div>

      {/* Scanning Line Effect */}
      <div
        className={`${styles.scanLine} ${isHidden ? styles.hidden : ""}`}
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
        }}
      />
    </>
  );
}
