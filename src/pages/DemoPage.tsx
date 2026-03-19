import { useState, useCallback } from 'react';
import EidBackground from '@/components/EidBackground';
import SpinningWheel from '@/components/SpinningWheel';
import { createDefaultSegments, WheelSegment } from '@/lib/wheelStore';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function DemoPage() {
  const navigate = useNavigate();
  const [segments] = useState<WheelSegment[]>(createDefaultSegments);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);

  const handleSpinEnd = useCallback((index: number) => {
    setResult(segments[index]);
    setSpinning(false);
    confetti({ particleCount: 80, spread: 360, origin: { y: 0.4 }, colors: ['#2d8a4e', '#d4a017', '#f0c040'] });
  }, [segments]);

  return (
    <EidBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-center">Demo Spin 🎯</h1>
        <p className="text-primary-foreground/70 mb-6 text-center">Try it out! This is just a demo 😄</p>

        <div className="mb-6">
          <SpinningWheel
            segments={segments}
            spinning={spinning}
            onSpinEnd={handleSpinEnd}
            size={Math.min(300, window.innerWidth - 60)}
          />
        </div>

        {result ? (
          <div className="animate-bounce-in text-center mb-6">
            <p className="font-display text-2xl font-bold">
              {result.amount !== '0' ? `${result.amount} ৳ — ` : ''}{result.message}
            </p>
            <button
              onClick={() => { setResult(null); setSpinning(false); }}
              className="mt-3 text-sm text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors"
            >
              Spin again
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSpinning(true)}
            disabled={spinning}
            className="btn-gold text-xl disabled:opacity-60"
          >
            {spinning ? '🎯 Spinning...' : '🎯 Spin Now!'}
          </button>
        )}

        <button
          onClick={() => navigate('/create')}
          className="mt-6 text-primary-foreground/50 hover:text-primary-foreground/70 text-sm transition-colors"
        >
          ✨ Create Your Own
        </button>
      </div>
    </EidBackground>
  );
}
