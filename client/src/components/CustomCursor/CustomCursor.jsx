import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      setTrail((prev) => [
        ...prev.slice(-8),
        { x: e.clientX, y: e.clientY, id: Date.now() },
      ]);
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
        window.getComputedStyle(target).cursor === "pointer";

      setIsPointer(isClickable);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseover", updateCursorStyle);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseover", updateCursorStyle);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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
            opacity: ((index + 1) / trail.length) * 0.3,
            transform: `translate(-50%, -50%) scale(${
              (index + 1) / trail.length
            })`,
          }}
        />
      ))}

      {/* Main Cursor */}
      <div
        className={[
          styles.customCursor,
          isPointer ? styles.pointer : "",
          isHidden ? styles.hidden : "",
        ].join(" ")}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className={styles.cursorInner} />
        <div className={styles.cursorGlow} />
      </div>

      {/* Outer Ring */}
      <div
        className={[
          styles.customCursorRing,
          isPointer ? styles.pointer : "",
          isHidden ? styles.hidden : "",
        ].join(" ")}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}
