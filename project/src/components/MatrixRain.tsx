import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect reduced motion unless URL contains ?effects=on
    const url = new URL(window.location.href);
    const effectsOn = url.searchParams.get('effects') === 'on';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !effectsOn) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');

    // Slightly smaller font for more subtle effect
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const isSmallScreen = window.innerWidth < 768;
    const activeColumnProbability = isSmallScreen ? 0.5 : 0.65;

    const draw = () => {
      // Dark overlay with stronger clear to reduce persistence
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Softer green text
      ctx.fillStyle = 'rgba(0, 255, 68, 0.7)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Randomly skip some columns to reduce density
        if (Math.random() > activeColumnProbability) continue;
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Balanced speed for visibility
    const interval = setInterval(draw, isSmallScreen ? 85 : 70);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.18] md:opacity-[0.14]"
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixRain;