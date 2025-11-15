"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

export interface MagicCardProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  disableAnimations?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 200;
const DEFAULT_GLOW_COLOR = "6, 182, 212"; // Cyan for multiverse theme

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "magic-particle";
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 8px rgba(${color}, 0.8), 0 0 16px rgba(${color}, 0.4);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = "",
  style = {},
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = false, // Disabled tilt effect
  enableMagnetism = false, // Disabled magnetism effect
  clickEffect = true,
  enableSpotlight = true, // Enabled spotlight effect
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  disableAnimations = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * (width - 20) + 10,
        Math.random() * (height - 20) + 10,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || !enableStars) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        // Entrance animation
        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );

        // Floating animation
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 360,
          duration: 3 + Math.random() * 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Pulsing glow
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, enableStars]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableSpotlight && spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableBorderGlow) {
        gsap.to(element, {
          boxShadow: `0 0 30px rgba(${glowColor}, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)`,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableSpotlight && spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableBorderGlow) {
        gsap.to(element, {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableSpotlight || !spotlightRef.current) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate intensity based on distance from center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      const intensity = Math.max(0.1, 1 - distance / maxDistance);

      // Update spotlight position and intensity
      gsap.to(spotlightRef.current, {
        background: `radial-gradient(${spotlightRadius}px circle at ${x}px ${y}px, rgba(${glowColor}, ${
          intensity * 0.2
        }) 0%, rgba(${glowColor}, ${intensity * 0.1}) 30%, transparent 60%)`,
        duration: 0.1,
        ease: "none",
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple effect
      const ripple = document.createElement("div");
      ripple.className = "magic-ripple";
      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.6) 0%, rgba(${glowColor}, 0.3) 30%, transparent 70%);
        left: ${x - 10}px;
        top: ${y - 10}px;
        pointer-events: none;
        z-index: 1000;
        transform-origin: center;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 15,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );

      // Card pulse effect
      gsap.to(element, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    if (enableSpotlight) {
      element.addEventListener("mousemove", handleMouseMove);
    }
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableSpotlight,
    enableBorderGlow,
    clickEffect,
    glowColor,
    spotlightRadius,
  ]);

  return (
    <>
      <style jsx>{`
        .magic-particle::before {
          content: "";
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: rgba(${glowColor}, 0.2);
          border-radius: 50%;
          z-index: -1;
          animation: pulse 2s ease-in-out infinite alternate;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0.1;
          }
        }

        .magic-ripple {
          mix-blend-mode: screen;
        }
      `}</style>

      <div
        ref={cardRef}
        className={`magic-card-container ${className} relative overflow-hidden cursor-pointer`}
        style={{
          ...style,
          position: "relative",
          overflow: "hidden",
          transformStyle: "preserve-3d",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
      >
        {/* Spotlight overlay */}
        {enableSpotlight && (
          <div
            ref={spotlightRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              opacity: 0,
              background: `radial-gradient(${spotlightRadius}px circle at 50% 50%, rgba(${glowColor}, 0.15) 0%, rgba(${glowColor}, 0.08) 30%, transparent 60%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
        {children}
      </div>
    </>
  );
};

export default MagicCard;
