
import React, { useRef, useState, MouseEvent } from 'react';

// Use React.useRef and React.useState for compatibility

function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const confettiCount = 80;
  const confetti: {x: number, y: number, r: number, d: number, color: string}[] = [];
  const colors = ['#ff8a00', '#e52e71', '#00c9ff', '#43e97b', '#f9d423', '#fc6076'];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  let angle = 0;
  let frame = 0;
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < confettiCount; i++) {
      const c = confetti[i];
      if (!ctx) continue;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, false);
      ctx.fillStyle = c.color;
      ctx.fill();
    }
    update();
    frame++;
    if (frame < 60) requestAnimationFrame(draw);
  }
  function update() {
    angle += 0.01;
    for (let i = 0; i < confettiCount; i++) {
      const c = confetti[i];
      c.y += Math.cos(angle + c.d) + 2 + c.r / 2;
      c.x += Math.sin(angle) * 2;
      if (c.x > W || c.x < 0 || c.y > H) {
        c.x = Math.random() * W;
        c.y = -10;
      }
    }
  }
  draw();
}

export default function ConfettiCelebration() {
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    setTimeout(() => {
      if (canvasRef.current) launchConfetti(canvasRef.current);
    }, 10);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleCelebrate}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1.1rem',
          borderRadius: '999px',
          background: 'linear-gradient(90deg,#ff8a00,#e52e71)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          cursor: 'pointer',
          fontWeight: 600,
          transition: 'transform 0.2s',
        }}
  onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(0.97)'}
  onMouseUp={(e: MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1)'}
      >
        🎉 Celebrate!
      </button>
      {showConfetti && (
        <canvas
          ref={canvasRef}
          width={220}
          height={120}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
