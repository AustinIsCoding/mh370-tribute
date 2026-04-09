import { useEffect, useRef } from 'react';

const STAR_COUNT = 239;
const GOLD = { r: 201, g: 168, b: 76 };

export default function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Each star gets a random position and pulse phase
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 1 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
    }));

    let animId;
    let startTime = performance.now();

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw(now) {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const opacity = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(elapsed * star.speed + star.phase));
        ctx.beginPath();
        ctx.arc(
          star.x * canvas.width,
          star.y * canvas.height,
          star.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="stars-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
