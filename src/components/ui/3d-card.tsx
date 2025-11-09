"use client";

import React, { createContext, useState, useContext, useRef, useEffect } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface CardContextType {
  mousePosition: MousePosition;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  isHovering: boolean;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
  intensity = 5, // Reduced default intensity from typical 15-20
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  intensity?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentRotation, setCurrentRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    
    // If just starting to hover, the card is at currentRotation position
    // We'll continue from there with mouse movement
    if (!isHovering) {
      setIsHovering(true);
    }
    
    setMousePosition({ x, y });
    
    // Update current rotation to match mouse position
    // This will be preserved when leaving so we can resume from here
    setCurrentRotation({
      x: x * intensity,
      y: -y * intensity
    });
  };

  const handleMouseLeave = () => {
    // When leaving, smoothly animate back to 0 from current position
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
    // Animate back to 0 from currentRotation (which is the last mouse position)
    setCurrentRotation({ x: 0, y: 0 });
  };

  return (
    <CardContext.Provider value={{ mousePosition, handleMouseMove, handleMouseLeave, isHovering }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={containerClassName}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={cardRef}
          className={className}
          style={{
            transformStyle: "preserve-3d",
            transform: isHovering
              ? `rotateY(${mousePosition.x * intensity}deg) rotateX(${-mousePosition.y * intensity}deg)`
              : `rotateY(${currentRotation.x}deg) rotateX(${currentRotation.y}deg)`,
            transition: isHovering ? "none" : "transform 0.5s ease-out",
          }}
        >
          {children}
        </div>
      </div>
    </CardContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={className}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  children,
  className,
  translateZ = 0,
  as: Component = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
  as?: React.ElementType;
  [key: string]: any;
}) => {
  const context = useContext(CardContext);

  return (
    <Component
      className={className}
      style={{
        // Keep translateZ constant - no zoom effect on hover
        transform: `translateZ(${translateZ}px)`,
        transition: "transform 0.3s ease-out",
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

