import { useState, useImperativeHandle, forwardRef } from 'react';
import './BubbleEffect.css';

export interface BubbleHandle {
  spawn: (x: number, y: number, char: string) => void;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
}

const colors = [
  '#2b2b2b', // Black ink
  '#4a4a4a', // Dark grey
  '#8b0000', // Red ink (grading/corrections)
  '#003366', // Blue ink
  '#d4af37', // Gold (rare idea)
  '#556b2f'  // Olive green
];

const BubbleEffect = forwardRef<BubbleHandle, {}>((_props, ref) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useImperativeHandle(ref, () => ({
    spawn: (x, y, char) => {
      const id = Date.now() + Math.random();
      const color = colors[Math.floor(Math.random() * colors.length)];
      setBubbles((prev) => [...prev, { id, x, y, char, color }]);

      // Auto-remove after animation
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, 1000);
    }
  }));

  return (
    <div className="bubble-container">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{ left: b.x, top: b.y, color: b.color, textShadow: `0 0 10px ${b.color}` }}
        >
          {b.char}
        </div>
      ))}
    </div>
  );
});

export default BubbleEffect;
