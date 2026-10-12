import React, { useEffect, useRef } from 'react';

interface AgentPreviewOrbProps {
  mode?: string;
  size?: number;
  className?: string;
}

export const AgentPreviewOrb: React.FC<AgentPreviewOrbProps> = ({
  mode = 'Balanced',
  size = 140,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const sphereR = size * 0.28;

    const render = () => {
      const speed = mode === 'Fast' ? 0.03 : mode === 'Careful' ? 0.012 : 0.02;
      angle += speed;
      ctx.clearRect(0, 0, size, size);

      // 1. Ambient outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, sphereR * 0.5, cx, cy, sphereR * 1.6);
      outerGlow.addColorStop(0, 'rgba(235, 215, 175, 0.12)');
      outerGlow.addColorStop(0.6, 'rgba(212, 175, 55, 0.03)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Tilted Orbit Ellipse (Behind sphere part)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, sphereR * 1.65, sphereR * 0.55, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 245, 225, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 3. Central Dark Translucent Sphere with Gold Rim
      const sphereBg = ctx.createRadialGradient(
        cx - sphereR * 0.3,
        cy - sphereR * 0.3,
        sphereR * 0.1,
        cx,
        cy,
        sphereR
      );
      sphereBg.addColorStop(0, 'rgba(32, 28, 22, 0.9)');
      sphereBg.addColorStop(0.7, 'rgba(12, 14, 18, 0.98)');
      sphereBg.addColorStop(1, 'rgba(6, 8, 10, 1)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = sphereBg;
      ctx.fill();

      // Crescent Rim highlight
      const rimGrad = ctx.createLinearGradient(
        cx - sphereR,
        cy - sphereR,
        cx + sphereR,
        cy + sphereR
      );
      rimGrad.addColorStop(0, 'rgba(255, 240, 210, 0.8)');
      rimGrad.addColorStop(0.4, 'rgba(212, 175, 55, 0.4)');
      rimGrad.addColorStop(1, 'rgba(80, 70, 50, 0.1)');
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 4. Tilted Orbit Ellipse (In-front of sphere part)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, sphereR * 1.65, sphereR * 0.55, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(255, 245, 225, 0.45)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // 5. Orbiting Satellites / Particles
      const satA = {
        x: Math.cos(angle) * (sphereR * 1.65),
        y: Math.sin(angle) * (sphereR * 0.55),
      };
      const satB = {
        x: Math.cos(angle + Math.PI) * (sphereR * 1.65),
        y: Math.sin(angle + Math.PI) * (sphereR * 0.55),
      };

      // Satellite 1
      ctx.fillStyle = '#fff9eb';
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(satA.x, satA.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Satellite 2
      ctx.fillStyle = '#f4efe6';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(satB.x, satB.y, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mode, size]);

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
