"use client";

import { useEffect, useRef } from "react";
import type { SiteDesignSettings } from "lib/site-design-schema";

const ROOM_COUNT = 3;

export default function CinematicEnvironment({
  settings,
}: {
  settings: SiteDesignSettings;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");

    // --- GSAP ScrollTrigger Integration for Polished Scrub Control ---
    let scrollTriggerInstance: any = null;
    let disposed = false;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);

        const intensity = settings.motionIntensity;

        scrollTriggerInstance = ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2, // Smoothed scrub control
          onUpdate: (self) => {
            const progress = self.progress;
            const reduced = media.matches || mobile.matches;
            const roomPosition = progress * (ROOM_COUNT - 1);

            root.style.setProperty("--cinema-progress", progress.toFixed(4));
            root.style.setProperty(
              "--camera-scale",
              reduced
                ? "1.015"
                : (1.025 + progress * 0.1 * intensity).toFixed(4)
            );
            root.style.setProperty(
              "--camera-y",
              reduced ? "0px" : `${(progress * -3.5 * intensity).toFixed(2)}vh`
            );
            root.style.setProperty(
              "--fog-back-shift",
              reduced ? "0px" : `${(progress * 4.6 * intensity).toFixed(2)}vh`
            );
            root.style.setProperty(
              "--fog-front-shift",
              reduced ? "0px" : `${(progress * -2.4 * intensity).toFixed(2)}vh`
            );
            root.style.setProperty(
              "--light-shift",
              reduced
                ? "0px"
                : `${(progress * 42 * intensity - 18).toFixed(2)}vw`
            );
            root.style.setProperty(
              "--floor-stretch",
              reduced ? "1" : (1 + progress * 0.22 * intensity).toFixed(4)
            );

            for (let index = 0; index < ROOM_COUNT; index += 1) {
              const distance = Math.abs(roomPosition - index);
              root.style.setProperty(
                `--room-${index}-opacity`,
                Math.max(0, 1 - distance).toFixed(4)
              );
            }
          },
        });
      });
    });

    // --- Lightweight Canvas Particle System (Gold Dust Particles) ---
    const canvas = canvasRef.current;
    let particleFrame: number;
    let cleanupResize: () => void = () => {};

    if (
      canvas &&
      settings.lightSweepEnabled &&
      !media.matches &&
      !mobile.matches
    ) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        cleanupResize = () => window.removeEventListener("resize", handleResize);

        const particles: {
          x: number;
          y: number;
          size: number;
          speedX: number;
          speedY: number;
          depth: number;
          opacity: number;
          pulse: number;
        }[] = [];

        const fraction = (value: number) => value - Math.floor(value);

        // Deterministic spacing keeps the atmosphere controlled on every load.
        for (let i = 0; i < 45; i++) {
          const seed = i + 1;
          particles.push({
            x: fraction(seed * 0.6180339887) * width,
            y: fraction(seed * 0.4142135623) * height,
            size: 0.6 + fraction(seed * 0.2718281828) * 1.8,
            speedX: (fraction(seed * 0.1414213562) - 0.5) * 0.1,
            speedY: -0.08 - fraction(seed * 0.1732050807) * 0.25,
            depth: 0.4 + fraction(seed * 0.2236067977) * 1.3,
            opacity: 0.08 + fraction(seed * 0.316227766) * 0.35,
            pulse: fraction(seed * 0.7071067811) * Math.PI,
          });
        }

        const animateParticles = () => {
          ctx.clearRect(0, 0, width, height);

          // Get progress variable from root properties
          const progressStr = root.style.getPropertyValue("--cinema-progress");
          const progress = progressStr ? parseFloat(progressStr) : 0;

          particles.forEach((p) => {
            p.pulse += 0.008;
            p.y += p.speedY * p.depth;
            p.x += p.speedX * p.depth;

            // Parallax shift based on depth and scroll progress
            const depthShiftY = progress * -35 * (p.depth - 0.6);
            const drawX = p.x;
            const drawY = p.y + depthShiftY;

            // Boundary wrapping
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            // Adjust coordinates to wraps
            let wrappedY = drawY % height;
            if (wrappedY < 0) wrappedY += height;

            // Pulse opacity
            const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

            ctx.beginPath();
            ctx.arc(drawX, wrappedY, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(197, 168, 128, ${currentOpacity.toFixed(3)})`;
            ctx.shadowColor = "rgba(197, 168, 128, 0.3)";
            ctx.shadowBlur = 3;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          particleFrame = requestAnimationFrame(animateParticles);
        };

        particleFrame = requestAnimationFrame(animateParticles);
      }
    }

    // --- Section Observer to animate text blocks ---
    const sections = Array.from(document.querySelectorAll("main section"));
    sections.forEach((section) => section.classList.add("cinematic-section"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-cinematic-visible",
            entry.isIntersecting
          );
        });
      },
      { rootMargin: "-8% 0px -12%", threshold: 0.08 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      disposed = true;
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (particleFrame) {
        cancelAnimationFrame(particleFrame);
      }
      cleanupResize();
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove("cinematic-section", "is-cinematic-visible");
      });
    };
  }, [settings.lightSweepEnabled, settings.motionIntensity]);

  return (
    <div ref={rootRef} className="cinematic-environment" aria-hidden="true">
      <div
        className="cinematic-room cinematic-room-entry"
        style={{ backgroundImage: `url("${settings.roomImages[0]}")` }}
      />
      <div
        className="cinematic-room cinematic-room-salon"
        style={{ backgroundImage: `url("${settings.roomImages[1]}")` }}
      />
      <div
        className="cinematic-room cinematic-room-archive"
        style={{ backgroundImage: `url("${settings.roomImages[2]}")` }}
      />
      <div className="cinematic-text-safety" />

      {/* Optional Gold Shimmer Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-70"
      />

      {settings.fogEnabled ? (
        <div className="cinematic-fog cinematic-fog-back" />
      ) : null}
      {settings.lightSweepEnabled ? (
        <div className="cinematic-light-sweep" />
      ) : null}
      {settings.fogEnabled ? (
        <div className="cinematic-fog cinematic-fog-front" />
      ) : null}
      {settings.floorReflectionEnabled ? (
        <div className="cinematic-floor" />
      ) : null}
      {settings.grainEnabled ? <div className="cinematic-grain" /> : null}
    </div>
  );
}
