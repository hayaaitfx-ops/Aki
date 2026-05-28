'use client';

import React, { useEffect, useRef } from 'react';

interface CanvasParticlesProps {
  theme: 'purple' | 'cyberpunk' | 'emerald' | 'crimson' | 'nordic' | 'sakura' | 'synthwave' | 'obsidian' | 'forest';
  overclocked?: boolean;
}

export const CanvasParticles: React.FC<CanvasParticlesProps> = ({ theme, overclocked = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, radius: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;
      }

      update() {
        const mult = overclocked ? 8 : 1;
        this.x += this.vx * mult;
        this.y += this.vy * mult;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interactive mouse distortion
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.2;
          this.y -= Math.sin(angle) * force * 1.2;
          this.size = this.baseSize * (1 + force * 1.5);
        } else {
          if (this.size > this.baseSize) {
            this.size -= 0.05;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Colors mapping
    const getThemeColors = () => {
      switch (theme) {
        case 'cyberpunk':
          return {
            particle: 'rgba(217, 119, 6, 0.28)',
            line: 'rgba(217, 119, 6, 0.05)',
          };
        case 'emerald':
          return {
            particle: 'rgba(5, 150, 105, 0.28)',
            line: 'rgba(5, 150, 105, 0.05)',
          };
        case 'crimson':
          return {
            particle: 'rgba(220, 38, 38, 0.28)',
            line: 'rgba(220, 38, 38, 0.05)',
          };
        case 'nordic':
          return {
            particle: 'rgba(6, 182, 212, 0.28)',
            line: 'rgba(6, 182, 212, 0.05)',
          };
        case 'sakura':
          return {
            particle: 'rgba(236, 72, 153, 0.28)',
            line: 'rgba(236, 72, 153, 0.05)',
          };
        case 'synthwave':
          return {
            particle: 'rgba(6, 182, 212, 0.28)',
            line: 'rgba(236, 72, 153, 0.05)',
          };
        case 'obsidian':
          return {
            particle: 'rgba(234, 179, 8, 0.28)',
            line: 'rgba(234, 179, 8, 0.05)',
          };
        case 'forest':
          return {
            particle: 'rgba(168, 85, 247, 0.28)',
            line: 'rgba(5, 150, 105, 0.05)',
          };
        default:
          return {
            particle: 'rgba(139, 92, 246, 0.28)',
            line: 'rgba(139, 92, 246, 0.05)',
          };
      }
    };

    const particles: Particle[] = Array.from({ length: 65 }, () => new Particle());

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors();
      ctx.fillStyle = colors.particle;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 0.85;

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect particles if they are close
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 105) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
