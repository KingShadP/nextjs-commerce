"use client";

import { useEffect, useRef, useState } from "react";

interface SovereignWebGLStageProps {
  isLowPerformance?: boolean;
}

export default function SovereignWebGLStage({ isLowPerformance = false }: SovereignWebGLStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef(0);

  const scrollProgressRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollSpeedRef = useRef(0);

  const smoothScrollProgressRef = useRef(0);
  const depthScaleRef = useRef(1.0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scale = isLowPerformance ? 0.5 : 0.85;
        setDimensions({
          width: Math.max(200, Math.round(rect.width * scale)),
          height: Math.max(200, Math.round(rect.height * scale)),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = e.clientX / window.innerWidth - 0.5;
      const yNorm = e.clientY / window.innerHeight - 0.5;
      mouseRef.current = { x: xNorm, y: yNorm };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      scrollProgressRef.current = Math.min(1.0, Math.max(0.0, scrollY / maxScroll));

      const diff = Math.abs(scrollY - lastScrollYRef.current);
      scrollSpeedRef.current = scrollSpeedRef.current * 0.84 + diff * 0.16;
      lastScrollYRef.current = scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLowPerformance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) {
      console.warn("WebGL not supported.");
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      ${isLowPerformance ? "precision mediump float;" : "precision highp float;"}
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll;
      uniform float u_mouse_velocity;
      uniform float u_scroll_speed;
      uniform float u_depth_scale;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        vec2 mouseOffset = u_mouse * 0.1;
        float driftAngle = u_time * 0.05;
        vec2 drift = vec2(sin(driftAngle), cos(driftAngle)) * 0.02;
        p += mouseOffset + drift;

        float r = length(p);
        float theta = atan(p.y, p.x);

        float kineticImpact = mix(u_mouse_velocity * 0.4, u_scroll_speed * 0.8, 0.4);
        float accelerationFactor = clamp(kineticImpact * 0.1, 0.0, 0.6);

        // Starfield
        float stars = 0.0;
        vec2 st1 = p * 12.0;
        vec2 ip1 = floor(st1);
        vec2 fp1 = fract(st1) - 0.5;
        float h1 = noise(ip1);
        if (h1 > 0.92) {
          float twinkle = sin(u_time * 1.2 + h1 * 6.28) * 0.5 + 0.5;
          stars += smoothstep(0.04, 0.0, length(fp1)) * twinkle * 0.25;
        }

        vec2 st2 = p * 24.0;
        vec2 ip2 = floor(st2);
        vec2 fp2 = fract(st2) - 0.5;
        float h2 = noise(ip2 + vec2(37.4, 82.1));
        if (h2 > 0.96) {
          float twinkle = sin(u_time * 2.2 + h2 * 6.28) * 0.5 + 0.5;
          stars += smoothstep(0.08, 0.0, length(fp2)) * twinkle * 0.4;
        }

        // Concentric Blueprint Circles representing technical design grid
        float orbit1 = smoothstep(0.0015, 0.0, abs(r - 0.18));
        float orbit2 = smoothstep(0.0012, 0.0, abs(r - 0.35));
        float orbit3 = smoothstep(0.0009, 0.0, abs(r - 0.52));
        float orbits = (orbit1 * 0.06) + (orbit2 * 0.04) + (orbit3 * 0.03);

        // Planetary Glowing Nodes
        vec2 planetPos1 = vec2(cos(u_time * 0.25) * 0.18, sin(u_time * 0.25) * 0.18);
        float planetGlow1 = 0.0008 / (length(p - planetPos1) + 0.001);

        vec2 planetPos2 = vec2(cos(-u_time * 0.15 + 2.0) * 0.35, sin(-u_time * 0.15 + 2.0) * 0.35);
        float planetGlow2 = 0.0012 / (length(p - planetPos2) + 0.001);

        vec2 planetPos3 = vec2(cos(u_time * 0.08 + 4.0) * 0.52, sin(u_time * 0.08 + 4.0) * 0.52);
        float planetGlow3 = 0.0018 / (length(p - planetPos3) + 0.0012);

        float allPlanets = planetGlow1 + planetGlow2 + planetGlow3;
        float depthCue = smoothstep(1.2, 0.05, r);

        // Tonal color palette: Cocoa Red / Muted Sand Gold
        vec3 colCocoa = vec3(0.36, 0.31, 0.27);  // Muted Cocoa
        vec3 colSand = vec3(0.77, 0.73, 0.69);   // Sand / Clay
        vec3 colAccent = vec3(0.77, 0.66, 0.50); // Muted Gold

        vec3 currentSecColor;
        if (u_scroll < 0.5) {
          float t = u_scroll / 0.5;
          currentSecColor = mix(colCocoa, colSand, t);
        } else {
          float t = (u_scroll - 0.5) / 0.5;
          currentSecColor = mix(colSand, colAccent, t);
        }

        float solarCore = 0.004 / (r + 0.002);
        float volumetricDrift = noise(uv * 6.0 + vec2(0.0, u_time * 0.2)) * 0.008 * (1.0 - r);

        float spaceStructures = stars * 1.2 + orbits * 1.0 + allPlanets;
        vec3 combinedColor = currentSecColor * spaceStructures + currentSecColor * (solarCore + volumetricDrift);

        float baseOpacity = 0.008 + (0.01 * (1.0 - accelerationFactor));
        float finalAlpha = baseOpacity * depthCue;

        gl_FragColor = vec4(combinedColor, finalAlpha);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("WebGL linkage failed:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1, 
       1, -1, 
      -1,  1, 
      -1,  1, 
       1, -1, 
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const scrollLoc = gl.getUniformLocation(program, "u_scroll");
    const mVelLoc = gl.getUniformLocation(program, "u_mouse_velocity");
    const sSpdLoc = gl.getUniformLocation(program, "u_scroll_speed");
    const depthScaleLoc = gl.getUniformLocation(program, "u_depth_scale");

    let animId: number;
    let startTime = Date.now();

    const render = () => {
      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      const dx = mX - lastMouseRef.current.x;
      const dy = mY - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      mouseVelocityRef.current = mouseVelocityRef.current * 0.94 + dist * 0.06;
      lastMouseRef.current = { x: mX, y: mY };

      scrollSpeedRef.current *= 0.94;

      const targetDepthScale = 1.0 + scrollProgressRef.current * 2.0; 
      const kLerp = Math.max(0.005, Math.min(0.15, 0.05 - mouseVelocityRef.current * 0.2));
      depthScaleRef.current = depthScaleRef.current * (1.0 - kLerp) + targetDepthScale * kLerp;

      const targetScroll = scrollProgressRef.current;
      const scrollLerp = Math.max(0.01, Math.min(0.15, 0.06 - mouseVelocityRef.current * 0.15));
      smoothScrollProgressRef.current = smoothScrollProgressRef.current * (1.0 - scrollLerp) + targetScroll * scrollLerp;

      gl.viewport(0, 0, dimensions.width, dimensions.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resLoc, dimensions.width, dimensions.height);
      gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);
      gl.uniform2f(mouseLoc, mX, mY);
      gl.uniform1f(scrollLoc, smoothScrollProgressRef.current);
      gl.uniform1f(mVelLoc, mouseVelocityRef.current);
      gl.uniform1f(sSpdLoc, Math.min(scrollSpeedRef.current * 0.06, 3.5));
      gl.uniform1f(depthScaleLoc, depthScaleRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [dimensions, isLowPerformance]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-10 opacity-70"
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full pointer-events-none block"
      />
    </div>
  );
}
