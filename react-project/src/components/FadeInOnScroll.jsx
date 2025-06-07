import React, { useRef, useEffect, useState } from "react";

function FadeInOnScroll({ children, className = "" }) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 한 번만 발동
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        opacity-0
        ${isVisible ? "animate-fadeSlide" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default FadeInOnScroll;
