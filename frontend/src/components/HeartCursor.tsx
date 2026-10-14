import { useEffect } from "react";
import "./HeartCursor.css";

function HeartCursor() {
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.sqrt(
        (e.clientX - lastX) ** 2 +
        (e.clientY - lastY) ** 2
      );

      // Nu crea prea multe inimioare
      if (distance < 12) return;

      lastX = e.clientX;
      lastY = e.clientY;

      const heart = document.createElement("span");

      heart.className = "cursor-heart";
      heart.innerHTML = Math.random() > 0.5 ? "♥" : "♡";

      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;

      // Random
      const size = 30 + Math.random() * 10;
      const rotation = Math.random() * 60 - 30;
      const x = Math.random() * 40 - 20;
      const y = Math.random() * 30 + 25;

      heart.style.fontSize = `${size}px`;
      heart.style.setProperty("--x", `${x}px`);
      heart.style.setProperty("--y", `${y}px`);
      heart.style.setProperty("--rotation", `${rotation}deg`);

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 900);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
}

export default HeartCursor;