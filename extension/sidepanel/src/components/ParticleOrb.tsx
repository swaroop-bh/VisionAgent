import React, { useEffect, useRef } from 'react';

interface ParticleOrbProps {
  status?: string;
  size?: number;
  className?: string;
}

export const ParticleOrb: React.FC<ParticleOrbProps> = ({
  status = 'Ready',
  size = 190,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const sphereRadius = size * 0.40;

    // Constellation of ambient floating golden dust particles
    const particleCount = 110;
    const particles = Array.from({ length: particleCount }, () => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * sphereRadius * 0.92;
      const sinPhi = Math.sin(phi);
      return {
        x: r * sinPhi * Math.cos(theta),
        y: r * sinPhi * Math.sin(theta),
        z: r * Math.cos(phi),
        speed: 0.003 + Math.random() * 0.006,
        size: 0.6 + Math.random() * 1.1,
        baseAlpha: 0.25 + Math.random() * 0.55,
      };
    });

    const render = () => {
      const speedMult = status === 'Reasoning' || status === 'Seeing' ? 0.035 : 0.016;
      t += speedMult;
      ctx.clearRect(0, 0, size, size);

      // 1. Concentric Subtle Halos around the Orb (from reference)
      const haloAlpha = 0.04 + Math.sin(t * 1.5) * 0.015;
      ctx.strokeStyle = `rgba(235, 215, 175, ${haloAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(212, 175, 55, ${haloAlpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.34, 0, Math.PI * 2);
      ctx.stroke();

      // Soft ambient radial aura
      const ambientGlow = ctx.createRadialGradient(
        cx,
        cy,
        sphereRadius * 0.5,
        cx,
        cy,
        sphereRadius * 1.28
      );
      ambientGlow.addColorStop(0, 'rgba(235, 215, 180, 0.09)');
      ambientGlow.addColorStop(0.7, 'rgba(180, 140, 70, 0.03)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.28, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Translucent Dark Glass Sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.clip(); // Clip everything to interior of sphere

      const sphereGrad = ctx.createRadialGradient(
        cx - sphereRadius * 0.25,
        cy - sphereRadius * 0.25,
        sphereRadius * 0.1,
        cx,
        cy,
        sphereRadius
      );
      sphereGrad.addColorStop(0, 'rgba(26, 24, 20, 0.85)');
      sphereGrad.addColorStop(0.65, 'rgba(12, 14, 18, 0.96)');
      sphereGrad.addColorStop(1, 'rgba(7, 8, 11, 1)');
      ctx.fillStyle = sphereGrad;
      ctx.fillRect(0, 0, size, size);

      // 3. Ambient 3D Rotating Golden Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cosY = Math.cos(p.speed);
        const sinY = Math.sin(p.speed);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        p.x = x1;
        p.z = z1;

        const depth = (p.z + sphereRadius) / (2 * sphereRadius);
        const drawX = cx + p.x;
        const drawY = cy + p.y;
        const alpha = Math.max(0.1, Math.min(0.9, p.baseAlpha * depth));

        ctx.fillStyle = `rgba(248, 238, 220, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size * (0.6 + depth * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Curved Flowing Golden Wave Ribbons (The Signature Reference Feature)
      const numWaves = 18;
      const waveSpan = sphereRadius * 1.86;
      const startX = cx - waveSpan / 2;

      for (let w = 0; w < numWaves; w++) {
        const normW = (w - numWaves / 2) / numWaves; // -0.5 to 0.5
        const yOffset = normW * (sphereRadius * 0.36);
        const freq = 0.024 + Math.sin(w * 0.35) * 0.004;
        const amp = (sphereRadius * 0.28) * Math.cos(normW * Math.PI);
        const phase = t + w * 0.14;

        ctx.beginPath();
        const steps = 64;
        for (let s = 0; s <= steps; s++) {
          const px = startX + (s / steps) * waveSpan;
          const nx = (s / steps - 0.5) * 2; // -1 to 1
          const windowFunc = Math.cos(nx * (Math.PI / 2));
          const py = cy + yOffset + Math.sin(px * freq + phase) * amp * windowFunc;

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        const centerProximity = 1 - Math.abs(normW) * 1.4;
        const strokeAlpha = Math.max(0.06, Math.min(0.72, 0.55 * centerProximity));

        // Ivory to soft gold wave line
        ctx.strokeStyle = `rgba(246, 235, 212, ${strokeAlpha})`;
        ctx.lineWidth = normW === 0 ? 1.3 : 0.95;
        ctx.stroke();

        // High-density golden sparkle nodes along wave crests
        if (w % 2 === 0) {
          for (let s = 3; s < steps; s += 6) {
            const px = startX + (s / steps) * waveSpan;
            const nx = (s / steps - 0.5) * 2;
            const windowFunc = Math.cos(nx * (Math.PI / 2));
            const py = cy + yOffset + Math.sin(px * freq + phase) * amp * windowFunc;

            ctx.fillStyle = `rgba(255, 248, 230, ${strokeAlpha * 1.4})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore(); // End sphere clipping

      // 5. Delicate Spherical Rim Edge Highlight (Gold / Ivory Crescent)
      const rimGrad = ctx.createLinearGradient(
        cx - sphereRadius,
        cy - sphereRadius,
        cx + sphereRadius,
        cy + sphereRadius
      );
      rimGrad.addColorStop(0, 'rgba(255, 245, 225, 0.75)');
      rimGrad.addColorStop(0.35, 'rgba(225, 190, 110, 0.45)');
      rimGrad.addColorStop(0.7, 'rgba(120, 100, 70, 0.15)');
      rimGrad.addColorStop(1, 'rgba(255, 245, 225, 0.6)');

      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, status]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="pointer-events-none"
      />
    </div>
  );
};
