'use client';
import React, { useRef, useState, useEffect } from 'react';

const BorderGlow = ({
  children,
  className = '',
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  borderRadius = 28,
  glowColor = '40 80 80',
  glowRadius = 40,
  edgeSensitivity = 30,
  glowIntensity = 1,
  backgroundColor = '#120F17',
  animated = false,
  ...props
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => {
        setIsHovered(false);
        setMousePosition({ x: -1000, y: -1000 });
      });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative group overflow-hidden ${className}`}
      style={{ borderRadius, padding: '1px' }}
      {...props}
    >
      {/* Highlight border on hover */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? glowIntensity : 0,
          background: `radial-gradient(${glowRadius * 4}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.4), transparent)`,
        }}
      />
      {/* Inner card content wrapper */}
      <div 
        className="relative z-10 w-full h-full border border-zinc-800"
        style={{ borderRadius: borderRadius - 1, backgroundColor }}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
