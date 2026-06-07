import { useEffect, useRef, useState } from "react";

export function AutoSlider({ children, speed = 30 }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrame: number;
    let scrollPosition = 0;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += 0.5;
        
        // Reset when we've scrolled halfway (since we duplicated content)
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ 
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "24px",
          overflow: "hidden",
          scrollBehavior: isPaused ? "smooth" : "auto",
        }}
      >
        {/* Original items */}
        {children}
        {/* Duplicated items for seamless loop */}
        {children}
      </div>
    </div>
  );
}
