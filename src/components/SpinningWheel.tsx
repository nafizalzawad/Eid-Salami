import { useRef, useEffect, useState, useCallback } from 'react';
import { WheelSegment } from '@/lib/wheelStore';

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinEnd?: (segmentIndex: number) => void;
  spinning?: boolean;
  size?: number;
}

export default function SpinningWheel({ segments, onSpinEnd, spinning = false, size = 320 }: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animRef = useRef<number>(0);
  const spinStartRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isSpinningRef = useRef(false);

  const drawWheel = useCallback((rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;
    const segCount = segments.length;
    const arc = (2 * Math.PI) / segCount;

    ctx.clearRect(0, 0, size, size);

    // Draw shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();

    // Draw segments
    for (let i = 0; i < segCount; i++) {
      const angle = rot + i * arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.closePath();
      ctx.fillStyle = segments[i].color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(11, size / 24)}px 'Baloo 2', cursive`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;
      
      const text = segments[i].amount !== '0' ? `${segments[i].amount} ৳` : '😄';
      ctx.fillText(text, radius - 16, 5);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(45, 90%, 55%)';
    ctx.fill();
    ctx.strokeStyle = 'hsl(40, 85%, 45%)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center star
    ctx.fillStyle = '#fff';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌙', cx, cy);

    // Pointer (top)
    ctx.beginPath();
    ctx.moveTo(cx - 12, 4);
    ctx.lineTo(cx + 12, 4);
    ctx.lineTo(cx, 28);
    ctx.closePath();
    ctx.fillStyle = 'hsl(0, 80%, 55%)';
    ctx.fill();
    ctx.strokeStyle = 'hsl(0, 70%, 40%)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [segments, size]);

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  useEffect(() => {
    if (!spinning || isSpinningRef.current) return;
    isSpinningRef.current = true;

    const segCount = segments.length;
    const targetIndex = Math.floor(Math.random() * segCount);
    const arc = (2 * Math.PI) / segCount;
    
    // Target: pointer is at top (3π/2 from positive x). We want segment targetIndex under pointer.
    const extraSpins = 5 + Math.random() * 3;
    const targetAngle = extraSpins * 2 * Math.PI + (2 * Math.PI - (targetIndex * arc + arc / 2)) + Math.PI / 2;
    
    targetRotationRef.current = targetAngle;
    spinStartRef.current = performance.now();
    const duration = 4000 + Math.random() * 2000;

    const animate = (now: number) => {
      const elapsed = now - spinStartRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = eased * targetRotationRef.current;
      
      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        isSpinningRef.current = false;
        onSpinEnd?.(targetIndex);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [spinning, segments, onSpinEnd, drawWheel]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="rounded-full"
      />
    </div>
  );
}
