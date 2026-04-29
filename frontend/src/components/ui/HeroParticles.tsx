"use client";
import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.maxLife = Math.random() * 50 + 30;
    this.life = this.maxLife;
    this.size = Math.random() * 4 + 1;
    // Neon accent colors matching VISHWAS brand but glowing
    const colors = ["#4ade80", "#22c55e", "#86efac", "#10b981", "#6E8B4A"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.size = Math.max(0, this.size * 0.96);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fill();
    
    // Neon Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
  }
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const mouse = { x: -100, y: -100 };
    let hasMoved = false;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Only emit if within bounds of the canvas
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        mouse.x = x;
        mouse.y = y;
        hasMoved = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hasMoved) {
        // Emit multiple particles on move for a denser trail
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(mouse.x, mouse.y));
        }
        hasMoved = false;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.size < 0.1) {
          particles.splice(i, 1);
        }
      }

      // Reset alpha and shadow to not affect clearRect in next frame
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-[5] pointer-events-none" 
      style={{ mixBlendMode: "screen" }}
    />
  );
}
