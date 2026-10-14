import { useMemo } from "react";
import "./FloatingHearts.css";

function FloatingHearts() {
  const hearts = useMemo(() => {
    const colors = [
      "#ff4d6d",
      "#ff5c7a",
      "#ff6b81",
      "#ff758f",
      "#ff8fa3",
      "#ff9fb2",
    ];

    return Array.from({ length: 15 }, (_, index) => ({
      id: index,
      left: `${5 + Math.random() * 90}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 6}s`,
      fontSize: `${0.7 + Math.random() * 1}rem`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="floating-hearts">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart"
          style={{
            left: heart.left,
            animationDelay: heart.animationDelay,
            animationDuration: heart.animationDuration,
            fontSize: heart.fontSize,
            color: heart.color,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

export default FloatingHearts;