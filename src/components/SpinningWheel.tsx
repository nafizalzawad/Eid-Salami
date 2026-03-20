import { useRef, useEffect, useState, useCallback } from 'react';
import { WheelSegment } from '@/lib/wheelStore';

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinEnd?: (segmentIndex: number) => void;
  spinning?: boolean;
  targetIndex?: number | null;
  size?: number;
}

export default function SpinningWheel({ segments, onSpinEnd, spinning = false, targetIndex = null, size = 320 }: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animRef = useRef<number>(0);
  const spinStartRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const [isTicking, setIsTicking] = useState(false);

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
    ctx.save();
    ctx.translate(cx, 16);
    // Add small tick animation rotation if ticking
    if (isTicking) {
      ctx.rotate(-0.1);
    }
    ctx.beginPath();
    ctx.moveTo(-14, -12);
    ctx.lineTo(14, -12);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fillStyle = '#ef4444'; // Bright red
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }, [segments, size]);

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  useEffect(() => {
    if (!spinning || targetIndex === null || isSpinningRef.current) return;
    isSpinningRef.current = true;

    const segCount = segments.length;
    const arc = (2 * Math.PI) / segCount;
    
    // Current rotation normalized to 0-2PI
    const currentBaseRot = rotation % (2 * Math.PI);
    
    // We want: (targetIndex * arc + arc/2 + rotation) % 2PI = 3PI/2 (Pointer at top)
    // So: Rotation_needed = (1.5*PI - (targetIndex * arc + arc/2) - currentRotation)
    let stopRotation = (1.5 * Math.PI) - (targetIndex * arc + arc / 2);
    
    // Make sure we spin forward at least several times
    let relativeRotation = (stopRotation - currentBaseRot);
    while (relativeRotation < 0) relativeRotation += 2 * Math.PI;
    
    const extraSpins = 6 + Math.random() * 2;
    const totalNewRotation = extraSpins * 2 * Math.PI + relativeRotation;
    
    const startTimeSource = performance.now();
    const startRotation = rotation;
    const duration = 5000;

    let lastTickAngle = -1;

    const animate = (now: number) => {
      const elapsed = now - startTimeSource;
      const progress = Math.min(elapsed / duration, 1);
      
      // Power 4 ease out for high-speed start and slow end
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentRot = startRotation + (eased * totalNewRotation);
      
      // Visual tick effect when passing a segment boundary
      const normalizedRot = currentRot % (2 * Math.PI);
      const currentTickAngle = Math.floor(normalizedRot / arc);
      if (currentTickAngle !== lastTickAngle) {
        setIsTicking(true);
        setTimeout(() => setIsTicking(false), 50);
        lastTickAngle = currentTickAngle;
      }

      setRotation(currentRot);
      drawWheel(currentRot);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const finalRot = startRotation + totalNewRotation;
        setRotation(finalRot);
        drawWheel(finalRot);
        
        setTimeout(() => {
          isSpinningRef.current = false;
          onSpinEnd?.(targetIndex);
        }, 1200); // Wait longer for the excitement to build
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [spinning, targetIndex, segments, onSpinEnd, drawWheel]);

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
