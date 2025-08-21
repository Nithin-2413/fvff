import React, { useRef, useEffect } from 'react';

interface SimpleStarBackgroundProps {
  className?: string;
}

const SimpleStarBackground: React.FC<SimpleStarBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    interface Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      color: string;
      angle: number;
      pulse: number;
    }

    const particles: Particle[] = [];
    const particleCount = 500;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        color: `hsl(${Math.random() * 60 + 40}, 100%, ${Math.random() * 50 + 50}%)`,
        angle: Math.random() * Math.PI * 2,
        pulse: Math.random() * 0.02 + 0.01
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(22, 0, 22, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add cosmic gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(100, 50, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(227, 155, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(22, 0, 22, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += Math.sin(particle.angle + time) * particle.speed;
        particle.y += Math.cos(particle.angle + time * 0.7) * particle.speed;
        particle.z += particle.speed * 10;

        // Reset particle if it goes off screen
        if (particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height || 
            particle.z > 1000) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.z = 0;
        }

        // Calculate size based on depth and pulse
        const depth = 1 - particle.z / 1000;
        const pulseFactor = 1 + Math.sin(time * 50 + index) * 0.3;
        const size = particle.size * depth * pulseFactor;

        // Calculate alpha based on depth
        const alpha = depth * (0.7 + Math.sin(time * 20 + index) * 0.3);

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        
        // Create particle gradient
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 2
        );
        particleGradient.addColorStop(0, `hsla(${40 + depth * 60}, 100%, ${50 + depth * 50}%, ${alpha})`);
        particleGradient.addColorStop(1, `hsla(${280 + depth * 40}, 100%, ${30 + depth * 30}%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.fill();

        // Add glow effect for bright particles
        if (Math.random() < 0.1) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${40 + depth * 60}, 100%, 80%, ${alpha * 0.2})`;
          ctx.fill();
        }
      });

      // Add moving light rays
      for (let i = 0; i < 5; i++) {
        const angle = time * 0.2 + (i * Math.PI * 2) / 5;
        const x1 = canvas.width / 2 + Math.cos(angle) * 100;
        const y1 = canvas.height / 2 + Math.sin(angle) * 100;
        const x2 = canvas.width / 2 + Math.cos(angle) * Math.max(canvas.width, canvas.height);
        const y2 = canvas.height / 2 + Math.sin(angle) * Math.max(canvas.width, canvas.height);

        const rayGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        rayGradient.addColorStop(0, 'rgba(227, 155, 0, 0.1)');
        rayGradient.addColorStop(0.5, 'rgba(100, 50, 255, 0.05)');
        rayGradient.addColorStop(1, 'rgba(227, 155, 0, 0)');

        ctx.strokeStyle = rayGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default SimpleStarBackground;